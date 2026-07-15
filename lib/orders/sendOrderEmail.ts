import { Resend } from "resend";
import type { TrabajoCompleto } from "./validateTrabajo";
import { createClient as createSessionClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_APIKEY);

const DOWNLOAD_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

const TYPE_LABELS: Record<string, string> = {
  INLAY: "Inlay",
  ONLAY: "Onlay",
  CARILLA: "Carilla",
  CORONA: "Corona",
  CORONA_IMPLANTE: "Corona sobre implante",
  CARTILEVER: "Cartilever",
  PONTICO: "Póntico"
};

const MATERIAL_BY_TYPE: Record<string, string> = {
  INLAY: "Disilicato",
  ONLAY: "Disilicato",
  CARILLA: "Disilicato",
  CORONA: "Disilicato",
  CORONA_IMPLANTE: "Zirconia",
  CARTILEVER: "Zirconia",
  PONTICO: "Disilicato"
};

async function sign(path: string | null) {
  if (!path) return null;

  const supabase = await createSessionClient();

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .createSignedUrl(path, DOWNLOAD_URL_TTL_SECONDS);

  if (error || !data) {
    return null;
  }

  return data.signedUrl;
}

export async function sendOrderEmail(
  trabajo: TrabajoCompleto
) {
  const superior = await sign(trabajo.url_superior);
  const inferior = await sign(trabajo.url_inferior);
  const mordida = await sign(trabajo.url_mordida);
  const gingival = await sign(trabajo.url_gingival);

  const piezasHtml = trabajo.piezas
    .map((pieza) => {

      const tibase =
        pieza.tipo === "CORONA_IMPLANTE"
          ? `
            <div style="font-size:13px;color:#666;margin-top:6px;">
                TiBase<br>
                Plataforma Ø ${pieza.tibase_plataforma} mm<br>
                Altura muñón ${pieza.tibase_cementado} mm<br>
                Gingival ${pieza.tibase_gingival} mm
            </div>
          `
          : "";

      return `
        <tr>
            <td>${pieza.numero}</td>
            <td>${TYPE_LABELS[pieza.tipo ?? ""] ?? "-"}</td>
            <td>${MATERIAL_BY_TYPE[pieza.tipo ?? ""] ?? "-"}</td>
            <td>${pieza.paleta ?? "-"}</td>
            <td>${pieza.colores ?? "-"}</td>
        </tr>

        ${
          tibase
            ? `
            <tr>
                <td colspan="5">
                    ${tibase}
                </td>
            </tr>
          `
            : ""
        }
      `;
    })
    .join("");

  const archivo = (nombre: string, url: string | null) =>
    url
      ? `<a href="${url}" style="
            display:inline-block;
            padding:10px 18px;
            background:#0A1C34;
            color:white;
            text-decoration:none;
            border-radius:6px;
            margin:4px;
        ">
            Descargar ${nombre}
        </a>`
      : "";

  const html = `
<!doctype html>

<html>

<body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="30">

<tr>

<td align="center">

<table width="760" style="
background:white;
border-radius:12px;
overflow:hidden;
border:1px solid #ddd;
">

<tr>

<td style="
background:#0A1C34;
color:white;
padding:30px;
">

<h1 style="margin:0;">
Nuevo Pedido Dental
</h1>

<div style="opacity:.8;margin-top:8px;">
Estado: <b>PENDIENTE DE PAGO</b>
</div>

</td>

</tr>

<tr>

<td style="padding:30px;">

<h2>Paciente</h2>

<table width="100%" cellspacing="0">

<tr>

<td><b>Nombre</b></td>

<td>
${trabajo.paciente?.nombre}
${trabajo.paciente?.apellido}
</td>

</tr>

<tr>

<td><b>Recepción</b></td>

<td>${trabajo.fecha_envio}</td>

</tr>

<tr>

<td><b>Entrega</b></td>

<td>${trabajo.fecha_entrega}</td>

</tr>

<tr>

<td><b>Centro</b></td>

<td>${trabajo.centro_medico} - ${trabajo.direccion_despacho}</td>

</tr>

<tr>

<td><b>Odontólogo</b></td>

<td>${trabajo.enviado_por}</td>

</tr>

</table>

<br><br>

<h2>Piezas</h2>

<table
width="100%"
cellpadding="8"
style="
border-collapse:collapse;
font-size:14px;
">

<thead>

<tr style="background:#eceff3;">

<th align="left">FDI</th>

<th align="left">Tipo</th>

<th align="left">Material</th>

<th align="left">Paleta</th>

<th align="left">Color</th>

</tr>

</thead>

<tbody>

${piezasHtml}

</tbody>

</table>

<br>

<h2>Notas</h2>

<div style="
background:#fafafa;
border:1px solid #ddd;
padding:15px;
border-radius:8px;
">

${trabajo.notas || "Sin observaciones."}

</div>

<br>

<h2>Archivos STL</h2>

${archivo("Superior", superior)}

${archivo("Inferior", inferior)}

${archivo("Mordida", mordida)}

${archivo("Gingival", gingival)}

<br><br>

<div style="
font-size:12px;
color:#777;
border-top:1px solid #eee;
padding-top:20px;
">

Pedido generado automáticamente por Digital Ceramic.

</div>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: process.env.DENTAL_EMAIL_TO!,
    subject: `Nuevo pedido dental`,
    html,
  });
}