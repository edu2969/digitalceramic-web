export type UserRole = "ODONTOLOGO" | "LABORATORIO" | "ADMINISTRADOR"

export function isUserRole(value: unknown): value is UserRole {
  return (
    value === "ODONTOLOGO" ||
    value === "LABORATORIO" ||
    value === "ADMINISTRADOR"
  )
}

export function dashboardPathFor(role: UserRole | null | undefined): string {
  // El odontólogo ve su propia lista; el administrador ve la lista de trabajos
  // de TODOS los odontólogos (misma vista, con la columna "Doctor").
  if (role === "ODONTOLOGO" || role === "ADMINISTRADOR") {
    return "/dashboard-odontologo"
  }
  return "/dashboard"
}
