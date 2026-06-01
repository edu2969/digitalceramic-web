export type UserRole = "ODONTOLOGO" | "LABORATORIO" | "ADMINISTRADOR"

export function isUserRole(value: unknown): value is UserRole {
  return (
    value === "ODONTOLOGO" ||
    value === "LABORATORIO" ||
    value === "ADMINISTRADOR"
  )
}

export function dashboardPathFor(role: UserRole | null | undefined): string {
  if (role === "ODONTOLOGO") return "/dashboard-odontologo"
  return "/dashboard"
}
