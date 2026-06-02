-- =============================================================================
-- Consolidación de políticas RLS  (profiles / trabajos / piezas / clinica / pacientes)
-- =============================================================================
-- Estado de partida (export real de la BD):
--   * El keying por `user_id` YA estaba correcto.
--   * Había políticas DUPLICADAS (pares "Users can ..." vs "... self ...").
--   * La política lab/admin sobre `profiles` hace un subselect sobre `profiles`
--     -> riesgo de "infinite recursion detected in policy for relation profiles".
--
-- Este script:
--   1. Crea una función SECURITY DEFINER para leer el rol SIN recursión.
--   2. Reemplaza todas las políticas de estas tablas por un set canónico:
--        - dueño (profiles.user_id = auth.uid())  OR  LAB/ADMIN
--   3. Mantiene `clinica`/`pacientes` con lectura/inserción abiertas a
--      autenticados (igual que hoy). Ver nota PII al final.
--
-- Idempotente. Ejecutar en Supabase -> SQL Editor.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Función anti-recursión: devuelve el rol del usuario actual.
--    SECURITY DEFINER + search_path fijo => salta RLS, evita recursión, y es
--    reutilizable en las políticas de profiles/trabajos/piezas.
-- -----------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select user_role
  from public.profiles
  where user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

-- Habilitar RLS (no-op si ya estaba activa).
alter table public.profiles  enable row level security;
alter table public.trabajos  enable row level security;
alter table public.piezas    enable row level security;
alter table public.clinica   enable row level security;
alter table public.pacientes enable row level security;

-- -----------------------------------------------------------------------------
-- 1. profiles
-- -----------------------------------------------------------------------------
drop policy if exists "Users can view own profile"   on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "profile lab/admin read all"   on public.profiles;
drop policy if exists "profile self insert"          on public.profiles;
drop policy if exists "profile self read"            on public.profiles;
drop policy if exists "profile self update"          on public.profiles;

-- SELECT: tu propio perfil, o todos si eres LAB/ADMIN (vía función, sin recursión).
create policy "profiles_select_own_or_staff"
  on public.profiles for select to authenticated
  using (
    auth.uid() = user_id
    or public.current_user_role() = any (array['LABORATORIO','ADMINISTRADOR']::public.user_role[])
  );

-- INSERT: solo tu propio perfil.
create policy "profiles_insert_self"
  on public.profiles for insert to authenticated
  with check (auth.uid() = user_id);

-- UPDATE: solo tu propio perfil (con WITH CHECK para no reasignarlo a otro user_id).
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. trabajos  (dueño del profile, o LAB/ADMIN)
-- -----------------------------------------------------------------------------
drop policy if exists "Users can manage own trabajos" on public.trabajos;
drop policy if exists "trabajo dentista own"          on public.trabajos;
drop policy if exists "trabajo lab/admin all"         on public.trabajos;

create policy "trabajos_owner_or_staff"
  on public.trabajos for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = trabajos.profile_id and p.user_id = auth.uid()
    )
    or public.current_user_role() = any (array['LABORATORIO','ADMINISTRADOR']::public.user_role[])
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = trabajos.profile_id and p.user_id = auth.uid()
    )
    or public.current_user_role() = any (array['LABORATORIO','ADMINISTRADOR']::public.user_role[])
  );

-- -----------------------------------------------------------------------------
-- 3. piezas  (dueño del trabajo, o LAB/ADMIN)
-- -----------------------------------------------------------------------------
drop policy if exists "Users can manage own piezas" on public.piezas;
drop policy if exists "pieza follows trabajo"       on public.piezas;

create policy "piezas_owner_or_staff"
  on public.piezas for all to authenticated
  using (
    exists (
      select 1
      from public.trabajos t
      join public.profiles p on p.id = t.profile_id
      where t.id = piezas.trabajo_id and p.user_id = auth.uid()
    )
    or public.current_user_role() = any (array['LABORATORIO','ADMINISTRADOR']::public.user_role[])
  )
  with check (
    exists (
      select 1
      from public.trabajos t
      join public.profiles p on p.id = t.profile_id
      where t.id = piezas.trabajo_id and p.user_id = auth.uid()
    )
    or public.current_user_role() = any (array['LABORATORIO','ADMINISTRADOR']::public.user_role[])
  );

-- -----------------------------------------------------------------------------
-- 4. clinica / pacientes  (se mantienen como estaban: lectura e inserción
--    abiertas a cualquier autenticado). Recreadas aquí solo para que el set
--    quede documentado y completo.
-- -----------------------------------------------------------------------------
drop policy if exists "clinica read"  on public.clinica;
drop policy if exists "clinica write" on public.clinica;

create policy "clinica read"  on public.clinica for select to authenticated using (true);
create policy "clinica write" on public.clinica for insert to authenticated with check (true);

drop policy if exists "pacientes read"  on public.pacientes;
drop policy if exists "pacientes write" on public.pacientes;

create policy "pacientes read"  on public.pacientes for select to authenticated using (true);
create policy "pacientes write" on public.pacientes for insert to authenticated with check (true);

-- NOTA PII (pacientes / clinica):
-- DECISIÓN DELIBERADA: lectura/inserción abiertas a cualquier autenticado.
-- Cualquier usuario logueado puede leer TODOS los pacientes y clínicas.
-- Si en el futuro se quiere acotar por dentista, hará falta un cambio de
-- modelo (p. ej. `pacientes.created_by uuid references auth.users`, o derivar
-- la propiedad desde `trabajos`) — no es posible solo con RLS sobre el esquema
-- actual porque estas tablas no tienen columna de dueño.

-- =============================================================================
-- Verificación
-- =============================================================================
-- select tablename, policyname, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('profiles','trabajos','piezas','clinica','pacientes')
-- order by tablename, policyname;
