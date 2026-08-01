import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {    
    const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_role", "ODONTOLOGO");

    if (error) {
        console.log("ERROR - ", error);
    }

    console.log(count); // número de registros

    return NextResponse.json({
      ok: true, 
      count: 190 + (count ?? 0),
      total: 300,
      limitDay: new Date("09-30-2026")
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}