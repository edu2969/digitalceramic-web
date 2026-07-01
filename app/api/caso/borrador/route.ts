import { NextResponse } from "next/server";
import { createClient as createSessionClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createSessionClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No hay sesión activa",
        },
        {
          status: 401,
        }
      );
    }

    console.log("User", user);

    const { data: perfil, error: errorPerfil } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if(!perfil || errorPerfil) {
      return NextResponse.json({
        ok: false,
        error: "No se obtuvo el perfil de sesión: " + errorPerfil.message
      }, {
        status: 500
      })
    }

    const { data, error } = await supabase
      .from("trabajos")
      .insert({
        profile_id: perfil.id,
        estado: "BORRADOR",
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          ok: false,
          error: "No fue posible crear el borrador.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}