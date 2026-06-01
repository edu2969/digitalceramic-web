@AGENTS.md

DigitalCeramic es una aplicación WEB, un portal para la venta de servicios odontológicos que incluye:
- Coronas Unitarias
- Coronas de prótesis fija

En una sección de "Upload" se permite subir la especificación de un caso, que incluye toda la información que permite a nuestro laboratorio aliado, contar con el desarrollo y seguimiento de los trabajos que les subimos como casos.

También se inluiría entonces un portal de acceso a los odontólogos, para hacer seguimiento de sus pedidos. 

Se incluye también, un portal para el labotario de modo de ber todos los pedidos solicitados, revisando las especificaciones y señalando cuándo los trabajos son completados.

Permite a los profesionales, subir sus trabajos con o sin cuenta, registrando al menos su "profile"

Para cualquier tarea relacionada con datos:

1. Revisar docs/db_schema.sql
2. Respetar todas las RLS en docs/db_rls.json
3. Nunca saltarse auth.uid()
4. Considerar las relaciones del esquema