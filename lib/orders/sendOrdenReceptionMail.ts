// lib/emails/sendDepositEmail.ts
import { Resend } from "resend";
import type { TrabajoCompleto } from "./validateTrabajo";
import { getFdiForGridIndex } from "@/components/upload-steps/types";

const resend = new Resend(process.env.RESEND_APIKEY);

const TYPE_LABELS: Record<string, string> = {
  INLAY: "Inlay",
  ONLAY: "Onlay",
  CARILLA: "Carilla",
  CORONA: "Corona",
  CORONA_IMPLANTE: "Corona sobre implante",
  CANTILEVER: "Cantilever",
  PONTICO: "Póntico"
};

export async function sendOrdenReceptionMail(
  senderEmail: string,
  trabajo: TrabajoCompleto
) {
  console.log("Enviando email de depósito: ", trabajo);

  const pacienteNombre = trabajo.paciente?.nombre || '';
  const pacienteApellido = trabajo.paciente?.apellido || '';
  const monto = trabajo.monto || 79990;

  // Generar HTML de las piezas
  const piezasHtml = trabajo.piezas
    .map((pieza) => {
      const tipo = TYPE_LABELS[pieza.tipo ?? ""] ?? "-";
      
      // Determinar si mostrar TiBase
      const tieneTiBase = pieza.tipo === "CORONA_IMPLANTE" &&
        pieza.conexion === "ATORNILLADA" &&
        (pieza.tibase_plataforma || pieza.tibase_cementado || pieza.tibase_gingival);

      const tiBaseHtml = tieneTiBase ? `
        <div style="font-size:12px; color:#16213E; background:#EEF2F7; padding:6px 14px; border-radius:6px; display:inline-block; border-left:3px solid #7C3AED; margin-top:6px;">
          <span style="font-weight:600; color:#0A1330;">🔩 TiBase:</span>
          Plataforma Ø ${pieza.tibase_plataforma ?? '-'} mm &nbsp;·&nbsp;
          Altura muñón ${pieza.tibase_cementado ?? '-'} mm &nbsp;·&nbsp;
          Gingival ${pieza.tibase_gingival ?? '-'} mm
        </div>
      ` : '';

      const conexionHtml = pieza.conexion === "CEMENTADA" ? `
        <span style="display:inline-block; font-size:11px; color:#3B9EFF; background:#E8F0FE; padding:2px 12px; border-radius:12px; font-weight:500; margin-top:4px;">
          🔹 Conexión cementada
        </span>
      ` : pieza.conexion === "ATORNILLADA" && pieza.tipo === "CORONA_IMPLANTE" ? `
        <span style="display:inline-block; font-size:11px; color:#7C3AED; background:#F0EAFF; padding:2px 12px; border-radius:12px; font-weight:500; margin-top:4px;">
          🔸 Conexión atornillada
        </span>
      ` : '';

      return `
        <tr style="border-bottom: 1px solid #EEF2F7;">
          <td style="padding: 10px 14px; font-weight: 600; color: #0A1330; font-size: 14px;">${getFdiForGridIndex(pieza.numero ?? 0)}</td>
          <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">${tipo}</td>
          <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">
            <span style="display: inline-block; background: #E8F0FE; color: #0A1330; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
              ${pieza.paleta ?? '-'}
            </span>
          </td>
          <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">
            <span style="display: inline-block; background: #0A1330; color: #ffffff; padding: 2px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">
              ${pieza.colores ?? '-'}
            </span>
          </td>
          <td style="padding: 10px 14px; color: #16213E; font-size: 14px;">
            ${tiBaseHtml}
            ${conexionHtml}
          </td>
        </tr>
      `;
    })
    .join("");

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
        
        <!-- HEADER con Logo -->
        <tr>
          <td style="background:#0A1330; padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
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
                  <span style="display:inline-block; background:#F4C20D; color:#0A1330; padding:6px 20px; border-radius:20px; font-size:12px; font-weight:700;">
                    💳 DATOS DE DEPÓSITO
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px;">

            <!-- Título principal -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:28px;">🏦</span>
                    <h2 style="font-size:20px; font-weight:700; color:#0A1330; margin:0; letter-spacing:-0.3px;">
                      Datos de Depósito
                    </h2>
                    <span style="display:inline-block; background:#F4C20D; color:#0A1330; padding:4px 16px; border-radius:20px; font-size:11px; font-weight:700; margin-left:8px;">
                      Transferencia
                    </span>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Resumen del pedido -->
            <div style="background:#EEF2F7; border-radius:10px; padding:16px 20px; margin-bottom:24px; border-left:4px solid #7C3AED;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px; color:#16213E;">
                    <span style="font-weight:600;">Pedido #${trabajo.id.slice(0, 8).toUpperCase()}</span>
                    <span style="margin:0 12px; color:#ccc;">|</span>
                    <span>${pacienteNombre} ${pacienteApellido}</span>
                  </td>
                  <td align="right" style="font-size:16px; color:#0A1330; font-weight:700;">
                    $${monto.toLocaleString('es-CL')}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Datos bancarios -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px; border-radius:12px; overflow:hidden; border:1px solid #D9E5F3; background:#F5F9FF;">
              <tbody>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #E8EEF5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#16213E; font-size:13px; font-weight:600; width:40%;">Banco</td>
                        <td style="color:#0A1330; font-weight:700; font-size:13px;">Banco Itaú</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #E8EEF5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#16213E; font-size:13px; font-weight:600; width:40%;">Nombre</td>
                        <td style="color:#0A1330; font-weight:700; font-size:13px;">VIA CAPACITACION LTDA.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #E8EEF5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#16213E; font-size:13px; font-weight:600; width:40%;">Tipo de cuenta</td>
                        <td style="color:#0A1330; font-weight:700; font-size:13px;">Cuenta Corriente</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #E8EEF5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#16213E; font-size:13px; font-weight:600; width:40%;">N° de cuenta</td>
                        <td style="color:#0A1330; font-weight:700; font-family:monospace; font-size:15px;">0214175664</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #E8EEF5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#16213E; font-size:13px; font-weight:600; width:40%;">RUT</td>
                        <td style="color:#0A1330; font-weight:700; font-family:monospace; font-size:15px;">76.809.468-3</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#16213E; font-size:13px; font-weight:600; width:40%;">E-mail comprobante</td>
                        <td style="color:#0A1330; font-weight:700; font-size:13px;">facturacion@digitalceramic.cl</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Información adicional -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px; border-radius:12px; overflow:hidden; border:1px solid #D9E5F3; background:#F5F9FF;">
              <tr>
                <td style="padding:18px 20px;">
                  <div style="display:flex; gap:12px; margin-bottom:14px; align-items:flex-start;">
                    <span style="font-size:18px;">📌</span>
                    <p style="margin:0; color:#16213E; font-size:13px; line-height:1.6;">
                      <strong>Importante:</strong> Al recibir tu comprobante de pago, iniciaremos la producción de tu trabajo.
                    </p>
                  </div>
                  <div style="display:flex; gap:12px; margin-bottom:14px; align-items:flex-start;">
                    <span style="font-size:18px;">⚠️</span>
                    <p style="margin:0; color:#16213E; font-size:13px; line-height:1.6;">
                      <strong>Revisa bien</strong> la información de tu caso antes de confirmar el envío.
                    </p>
                  </div>
                  <div style="display:flex; gap:12px; align-items:flex-start;">
                    <span style="font-size:18px;">⏱️</span>
                    <p style="margin:0; color:#16213E; font-size:13px; line-height:1.6;">
                      <strong>Plazo de entrega:</strong> El trabajo estará listo en 
                      <strong style="color:#0A1330;">7 días corridos</strong> a partir del día de confirmación del depósito.
                    </p>
                  </div>
                </td>
              </tr>
            </table>

            <!-- DETALLE DEL TRABAJO -->
            <div style="background:#FAFBFC; border-radius:12px; border:1px solid #EEF2F7; padding:20px; margin-bottom:28px;">
              <h3 style="font-size:15px; font-weight:700; color:#0A1330; margin:0 0 16px 0; letter-spacing:-0.3px;">
                📋 Detalle del Trabajo
              </h3>

              <!-- Información del paciente -->
              <div style="margin-bottom:20px;">
                <h4 style="font-size:13px; font-weight:600; color:#0A1330; margin:0 0 8px 0;">👤 Datos del Paciente</h4>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                  <tr>
                    <td style="padding:4px 0; color:#16213E; width:40%;"><strong>Nombre completo</strong></td>
                    <td style="padding:4px 0; color:#0A1330;">${pacienteNombre} ${pacienteApellido}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#16213E;"><strong>Fecha de recepción</strong></td>
                    <td style="padding:4px 0; color:#0A1330;">${trabajo.fecha_envio || 'No definida'}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#16213E;"><strong>Fecha de entrega</strong></td>
                    <td style="padding:4px 0; color:#0A1330;">${trabajo.fecha_entrega || 'No definida'}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#16213E;"><strong>Centro médico</strong></td>
                    <td style="padding:4px 0; color:#0A1330;">${trabajo.centro_medico || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#16213E;"><strong>Dirección de despacho</strong></td>
                    <td style="padding:4px 0; color:#0A1330;">${trabajo.direccion_despacho || 'No especificada'}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#16213E;"><strong>Odontólogo</strong></td>
                    <td style="padding:4px 0; color:#0A1330;">${trabajo.enviado_por || 'No especificado'}</td>
                  </tr>
                </table>
              </div>

              <!-- Piezas -->
              <div>
                <h4 style="font-size:13px; font-weight:600; color:#0A1330; margin:0 0 8px 0;">🦷 Piezas Solicitadas</h4>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px; border-radius:8px; overflow:hidden; border:1px solid #EEF2F7;">
                  <thead>
                    <tr style="background:#102A52;">
                      <th style="padding:8px 12px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">FDI</th>
                      <th style="padding:8px 12px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Tipo</th>
                      <th style="padding:8px 12px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Paleta</th>
                      <th style="padding:8px 12px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Color</th>
                      <th style="padding:8px 12px; text-align:left; color:#ffffff; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Detalles</th>
                    </tr>
                  </thead>
                  <tbody style="background:#ffffff;">
                    ${piezasHtml}
                  </tbody>
                </table>
              </div>

              <!-- Notas -->
              ${trabajo.notas ? `
                <div style="margin-top:16px;">
                  <h4 style="font-size:13px; font-weight:600; color:#0A1330; margin:0 0 4px 0;">📝 Notas</h4>
                  <div style="background:#EEF2F7; border-radius:8px; padding:12px 16px; color:#16213E; font-size:13px; line-height:1.6; white-space:pre-wrap;">
                    ${trabajo.notas}
                  </div>
                </div>
              ` : ''}

              <!-- Archivos STL -->
              <div style="margin-top:16px;">
                <h4 style="font-size:13px; font-weight:600; color:#0A1330; margin:0 0 4px 0;">📎 Archivos STL</h4>
                <div style="background:#EEF2F7; border-radius:8px; padding:12px 16px; font-size:13px; color:#16213E;">
                  ${trabajo.archivo_superior ? `✔ Superior: ${trabajo.archivo_superior}` : '✖ Superior: No subido'}<br>
                  ${trabajo.archivo_inferior ? `✔ Inferior: ${trabajo.archivo_inferior}` : '✖ Inferior: No subido'}<br>
                  ${trabajo.archivo_mordida ? `✔ Mordida: ${trabajo.archivo_mordida}` : '✖ Mordida: No subido'}<br>
                  ${trabajo.archivo_gingival ? `✔ Gingival: ${trabajo.archivo_gingival}` : '✖ Gingival: No subido'}
                </div>
              </div>
            </div>

            <!-- Botón de WhatsApp -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A1330; border-radius:10px; overflow:hidden;">
              <tr>
                <td style="padding:16px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#ffffff; font-size:13px;">
                        <div style="font-weight:600; font-size:14px;">¿Tienes dudas sobre el pago?</div>
                        <div style="opacity:0.7; margin-top:2px;">Contáctanos por WhatsApp para asistencia</div>
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
                Este correo fue generado automáticamente con los datos de depósito y detalle del pedido.
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

  console.log("-------------->", process.env.NEXT_PUBLIC_SITE_URL == "http://localhost:3000" ? "contacto@digitalceramic.cl" : senderEmail);

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: process.env.NEXT_PUBLIC_SITE_URL == "http://localhost:3000" ? "contacto@digitalceramic.cl" : senderEmail,
    subject: `Datos de depósito - Pedido #${trabajo.id.slice(0, 8).toUpperCase()}`,
    html,
  });
}