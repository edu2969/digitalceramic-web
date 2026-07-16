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
  console.log("Enviando email: ", trabajo);
  const superior = await sign(trabajo.url_superior);
  const inferior = await sign(trabajo.url_inferior);
  const mordida = await sign(trabajo.url_mordida);
  const gingival = await sign(trabajo.url_gingival);

  const piezasHtml = trabajo.piezas
    .map((pieza) => {
      const tipo = TYPE_LABELS[pieza.tipo ?? ""] ?? "-";
      const material = MATERIAL_BY_TYPE[pieza.tipo ?? ""] ?? "-";

      // Determinar si mostrar TiBase (solo para CORONA_IMPLANTE atornillada)
      const tieneTiBase = pieza.tipo === "CORONA_IMPLANTE" &&
        pieza.conexion === "ATORNILLADA" &&
        (pieza.tibase_plataforma || pieza.tibase_cementado || pieza.tibase_gingival);

      // TiBase en formato inline (más moderno)
      const tiBaseHtml = tieneTiBase ? `
            <tr>
                <td colspan="5" style="padding: 4px 0 12px 20px; border: none;">
                    <div style="font-size: 12px; color: #16213E; background: #EEF2F7; padding: 8px 14px; border-radius: 6px; display: inline-block; border-left: 3px solid #7C3AED;">
                        <span style="font-weight: 600; color: #0A1330;">🔩 TiBase:</span>
                        Plataforma Ø ${pieza.tibase_plataforma ?? '-'} mm &nbsp;·&nbsp;
                        Altura muñón ${pieza.tibase_cementado ?? '-'} mm &nbsp;·&nbsp;
                        Gingival ${pieza.tibase_gingival ?? '-'} mm
                    </div>
                </td>
            </tr>
        ` : '';

      // Conexión como badge (cuando corresponde)
      const conexionHtml = pieza.conexion === "CEMENTADA" ? `
            <tr>
                <td colspan="5" style="padding: 2px 0 8px 20px; border: none;">
                    <span style="display: inline-block; font-size: 11px; color: #3B9EFF; background: #E8F0FE; padding: 2px 12px; border-radius: 12px; font-weight: 500;">
                        🔹 Conexión cementada
                    </span>
                </td>
            </tr>
        ` : pieza.conexion === "ATORNILLADA" && pieza.tipo === "CORONA_IMPLANTE" ? `
            <tr>
                <td colspan="5" style="padding: 2px 0 8px 20px; border: none;">
                    <span style="display: inline-block; font-size: 11px; color: #7C3AED; background: #F0EAFF; padding: 2px 12px; border-radius: 12px; font-weight: 500;">
                        🔸 Conexión atornillada
                    </span>
                </td>
            </tr>
        ` : '';

      // Determinar si la fila tiene detalles adicionales
      const tieneDetalles = tieneTiBase || pieza.conexion === "CEMENTADA" ||
        (pieza.conexion === "ATORNILLADA" && pieza.tipo === "CORONA_IMPLANTE");

      return `
            <tr style="border-bottom: 1px solid #EEF2F7;">
                <td style="padding: 10px 14px; font-weight: 600; color: #0A1330; font-size: 14px;">${pieza.numero}</td>
                <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">${tipo}</td>
                <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">
                    <span style="display: inline-block; background: #E8F0FE; color: #0A1330; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                        ${material}
                    </span>
                </td>
                <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">${pieza.paleta ?? '-'}</td>
                <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">
                    <span style="display: inline-block; background: #0A1330; color: #ffffff; padding: 2px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                        ${pieza.colores ?? '-'}
                    </span>
                </td>
            </tr>
            ${tieneDetalles ? `
                <tr>
                    <td colspan="5" style="padding: 0 0 12px 0; border: none;">
                        ${tiBaseHtml}
                        ${conexionHtml}
                    </td>
                </tr>
            ` : ''}
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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#EEF2F7; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7; padding:40px 20px;">
  <tr>
    <td align="center">
      <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(10,19,48,0.08);">
        
        <!-- HEADER con Logo y Estado -->
        <tr>
          <td style="background:#0A1330; padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <!-- Logo de la empresa -->
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <img 
                        src="${process.env.NEXT_PUBLIC_SITE_URL}/logo_02.png" 
                        alt="Digital Ceramic" 
                        style="height:48px; width:auto; border-radius:8px;"
                      />
                      <div>
                        <span style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:-0.5px;">Digital Ceramic</span>
                        <span style="display:block; font-size:11px; color:rgba(255,255,255,0.6); font-weight:300;">Laboratorio Dental</span>
                      </div>
                    </div>                    
                  </div>
                </td>
                <td align="right">
                  <span style="display:inline-block; background:#7C3AED; color:#ffffff; padding:6px 20px; border-radius:20px; font-size:12px; font-weight:600;">
                    NUEVO PEDIDO
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px;">

            <!-- Estado del pedido -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px; background:#0A1330; border-radius:10px; overflow:hidden;">
              <tr>
                <td style="padding:14px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#ffffff; font-size:13px;">
                        <span style="opacity:0.7;">Estado actual:</span>
                        <span style="font-weight:600; background:#F4C20D; color:#0A1330; padding:2px 14px; border-radius:12px; margin-left:8px; font-size:12px;">PENDIENTE DE PAGO</span>
                      </td>
                      <td align="right" style="color:rgba(255,255,255,0.6); font-size:12px;">
                        Orden #${trabajo.id.slice(0, 8).toUpperCase()}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Resumen del pedido -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#EEF2F7; border-radius:8px; padding:12px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:12px; color:#0A1330; font-weight:600;">
                        📋 Resumen del pedido
                      </td>
                      <td align="right" style="font-size:14px; color:#0A1330; font-weight:700;">
                        ${trabajo.piezas?.length || 0} pieza${trabajo.piezas?.length !== 1 ? 's' : ''}
                        ${trabajo.monto ? `· $${trabajo.monto.toLocaleString()}` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Información del paciente -->
            <h2 style="font-size:15px; font-weight:700; color:#0A1330; margin:0 0 12px 0; letter-spacing:-0.3px;">
              👤 Datos del Paciente
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#FAFBFC; border-radius:10px; border:1px solid #EEF2F7; padding:14px 18px;">
                  <table width="100%" cellpadding="4" cellspacing="0" style="font-size:13px;">
                    <tr>
                      <td style="color:#0A1330; font-weight:600; width:110px;">Nombre completo</td>
                      <td style="color:#16213E;">${trabajo.paciente?.nombre || ''} ${trabajo.paciente?.apellido || ''}</td>
                    </tr>
                    <tr>
                      <td style="color:#0A1330; font-weight:600;">Fecha de recepción</td>
                      <td style="color:#16213E;">${trabajo.fecha_envio || 'No definida'}</td>
                    </tr>
                    <tr>
                      <td style="color:#0A1330; font-weight:600;">Fecha de entrega</td>
                      <td style="color:#16213E;">${trabajo.fecha_entrega || 'No definida'}</td>
                    </tr>
                    <tr>
                      <td style="color:#0A1330; font-weight:600;">Centro médico</td>
                      <td style="color:#16213E;">${trabajo.centro_medico || 'No especificado'}</td>
                    </tr>
                    <tr>
                      <td style="color:#0A1330; font-weight:600;">Dirección de despacho</td>
                      <td style="color:#16213E;">${trabajo.direccion_despacho || 'No especificada'}</td>
                    </tr>
                    <tr>
                      <td style="color:#0A1330; font-weight:600;">Odontólogo</td>
                      <td style="color:#16213E;">${trabajo.enviado_por || 'No especificado'}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Piezas -->
            <h2 style="font-size:15px; font-weight:700; color:#0A1330; margin:0 0 10px 0; letter-spacing:-0.3px;">
              🦷 Piezas Solicitadas
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px; margin-bottom:28px; border-radius:10px; overflow:hidden; border:1px solid #EEF2F7;">
              <thead>
                <tr style="background:#102A52;">
                  <th style="padding:10px 14px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">FDI</th>
                  <th style="padding:10px 14px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Tipo</th>
                  <th style="padding:10px 14px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Material</th>
                  <th style="padding:10px 14px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Paleta</th>
                  <th style="padding:10px 14px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Color</th>
                </tr>
              </thead>
              <tbody style="background:#ffffff;">
                ${piezasHtml}
              </tbody>
            </table>

            <!-- Notas -->
            ${trabajo.notas ? `
              <h2 style="font-size:15px; font-weight:700; color:#0A1330; margin:0 0 8px 0; letter-spacing:-0.3px;">
                📝 Notas
              </h2>
              <div style="background:#FAFBFC; border:1px solid #EEF2F7; border-radius:10px; padding:12px 16px; margin-bottom:28px; color:#16213E; font-size:13px; line-height:1.6;">
                ${trabajo.notas}
              </div>
            ` : ''}

            <!-- Archivos STL -->
            <h2 style="font-size:15px; font-weight:700; color:#0A1330; margin:0 0 10px 0; letter-spacing:-0.3px;">
              📎 Archivos STL
            </h2>
            <div style="background:#FAFBFC; border:1px solid #EEF2F7; border-radius:10px; padding:16px 20px; margin-bottom:32px;">
              ${archivo("Superior", superior)}
              ${archivo("Inferior", inferior)}
              ${archivo("Mordida", mordida)}
              ${archivo("Gingival", gingival)}
              ${!superior && !inferior && !mordida && !gingival ? '<span style="color:#999; font-size:13px;">No hay archivos adjuntos</span>' : ''}
            </div>

            <!-- Botón de WhatsApp -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A1330; border-radius:10px; overflow:hidden;">
              <tr>
                <td style="padding:16px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#ffffff; font-size:13px;">
                        <div style="font-weight:600; font-size:14px;">¿Necesitas ayuda con este pedido?</div>
                        <div style="opacity:0.7; margin-top:2px;">Responde a este correo o contáctanos por WhatsApp</div>
                      </td>
                      <td align="right">
                        <a href="https://wa.me/56994974378" target="_blank" style="
                          display: inline-block;
                          background: #22B35E;
                          color: #ffffff;
                          padding: 10px 24px;
                          border-radius: 8px;
                          text-decoration: none;
                          font-weight: 600;
                          font-size: 13px;
                        ">
                          💬 WhatsApp
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <div style="text-align:center; margin-top:32px; font-size:11px; color:#999; border-top:1px solid #EEF2F7; padding-top:18px;">
              <p style="margin:0 0 4px 0;">
                <strong style="color:#0A1330;">Digital Ceramic</strong> · Laboratorio Dental
              </p>
              <p style="margin:0; color:#999; font-size:11px;">
                Este correo fue generado automáticamente al registrar un nuevo pedido.
              </p>
              <p style="margin:8px 0 0 0; color:#ccc; font-size:10px;">
                ${new Date().getFullYear()} Digital Ceramic. Todos los derechos reservados.
              </p>
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