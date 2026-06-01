import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  // En recuperación de contraseña siempre llevamos al formulario de nueva clave,
  // no al dashboard.
  const next =
    type === "recovery"
      ? "/reset-password"
      : searchParams.get("next") ?? "/dashboard"

  if (!token_hash || !type) {
    return NextResponse.redirect(
      `${origin}/login?error=enlace_invalido`
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash, type })

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=enlace_expirado`
    )
  }

  return NextResponse.redirect(`${origin}${next}`)
}
