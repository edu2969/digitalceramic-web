-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  nombre text,
  apellido text,
  telefono numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  centro_medico text,
  direccion text,
  numero_registro text,
  avatar_url text,
  user_role USER-DEFINED,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.trabajos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  paciente_id uuid,
  clinica_id uuid,
  enviado_por text,
  fecha_envio date,
  fecha_entrega date,
  monto numeric,
  notas text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  url_superior text,
  url_inferior text,
  url_mordida text,
  url_gingival text,
  profile_id uuid NOT NULL,
  estado USER-DEFINED NOT NULL DEFAULT 'CREADO'::trabajo_estado,
  CONSTRAINT trabajos_pkey PRIMARY KEY (id),
  CONSTRAINT trabajos_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT trabajos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT trabajos_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id)
);
CREATE TABLE public.piezas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trabajo_id uuid,
  numero numeric,
  paleta text,
  colores text,
  tipo text,
  tibase_cementado numeric,
  tibase_plataforma numeric,
  tibase_gingival numeric,
  conexion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT piezas_pkey PRIMARY KEY (id),
  CONSTRAINT piezas_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES public.trabajos(id)
);
CREATE TABLE public.pacientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text,
  apellido text,
  fecha_nacimiento date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pacientes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.clinica (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text,
  direccion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT clinica_pkey PRIMARY KEY (id)
);