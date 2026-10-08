# Operación de SMS — Taller LeadPrime

Este documento activa la confirmación y los recordatorios SMS del **Taller del 17 de octubre** sin exponer credenciales ni enviar mensajes a quien no dio consentimiento.

## Comportamiento implementado

- El formulario pide una **casilla SMS separada** del consentimiento de correo.
- Cada consentimiento guarda fecha, versión y quién lo confirmó (`web_self` o el agente de equipo).
- Un registro público duplicado **no puede modificar** el consentimiento, canal ni disparar un SMS. Sólo reenvía el correo de invitación.
- Un agente autenticado con PIN puede registrar un consentimiento nuevo al hablar con la persona.
- Si el SMS automático no está configurado o falla, el equipo recibe un texto para **copiar y pegar** y puede registrar que lo envió manualmente.
- El panel muestra consentimiento, estado de envío, entrega, fallos, STOP/respuestas y recordatorios SMS.
- `STOP` bloquea nuevos SMS y recordatorios; `START` restablece la posibilidad de un reintento autorizado.
- Los callbacks del proveedor se guardan en una cola durable del Core hasta que el landing confirma su recepción.

## Orden de despliegue

1. Publicar primero el repositorio **`g3lasio/leadprime`** (Core).
2. Verificar que Railway aplicó la migración `452_taller_sms_eventos.sql`.
3. Configurar las variables de Core y de landing que aparecen abajo.
4. Publicar **`g3lasio/leadprime-landing`**.
5. Probar un registro con un número controlado, la entrega, `STOP`, `START` y un recordatorio.
6. Sólo después de la prueba, usar el reenvío automático desde `/admin/taller`.

Mientras falte alguna variable crítica, el sistema **falla cerrado**: no manda el SMS automático y conserva el respaldo de copiar/pegar para el equipo.

## Variables en Railway

### Servicio Core (`g3lasio/leadprime`)

| Variable | Requisito |
|---|---|
| `TALLER_SMS_SHARED_SECRET` | Secreto nuevo de al menos 32 caracteres; debe coincidir exactamente con el landing. Generarlo dentro de una consola segura, por ejemplo `openssl rand -hex 32`. |
| `TALLER_LANDING_STATUS_URL` | URL HTTPS del landing seguida de `/api/taller/sms-status`. |
| `TWILIO_ACCOUNT_SID` | Credencial de la cuenta Twilio principal. |
| `TWILIO_AUTH_TOKEN` | Credencial de la cuenta Twilio principal. |
| `TWILIO_MESSAGING_SERVICE_SID` | Messaging Service aprobado para estos SMS. |
| `TWILIO_SYSTEM_FROM_NUMBER` | Número dedicado de LeadPrime Events; **no** puede pertenecer a un contratista. |
| `BASE_URL` / `WEBHOOK_BASE_URL` | URL pública HTTPS del Core; deben apuntar al mismo dominio público de producción. |

### Servicio landing (`g3lasio/leadprime-landing`)

| Variable | Requisito |
|---|---|
| `TALLER_SMS_GATEWAY_URL` | URL HTTPS del Core seguida de `/api/twilio/taller-sms/sms`. |
| `TALLER_SMS_SHARED_SECRET` | El mismo secreto de al menos 32 caracteres configurado en Core. |
| `NEON_DATABASE_URL` | Base de datos del landing; ya necesaria para el registro y el panel. |
| `TALLER_TEAM_PIN` | PIN privado para `/taller/equipo` y `/admin/taller`. |

## Configuración de Twilio

1. Configurar el SMS entrante del número de LeadPrime Events hacia el endpoint HTTPS canónico del Core: `/api/phone/inbound-sms`.
2. Mantener validación de firma Twilio en producción.
3. El Core configura el callback de estados de entrega hacia `/api/twilio/sms-status` usando su URL pública.
4. Confirmar que el número dedicado está incluido y aprobado dentro del Messaging Service correspondiente.

> El endpoint canónico ahora intercepta el número de eventos **antes** del flujo de teléfonos de contratistas. Así un `STOP` no se puede perder aunque el número de eventos no exista en `phone_numbers`.

## Prueba de aceptación

Con un teléfono de prueba controlado:

1. Registrar con correo y consentimiento SMS marcado.
2. Confirmar que llega el SMS y que el panel muestra `sent` o `delivered`.
3. Responder `STOP`; confirmar que el panel muestra `STOP / no enviar` y que `Reenviar SMS` queda bloqueado.
4. Responder `START`; confirmar que el panel permite un reintento explícito.
5. Ejecutar `Correr recordatorios` en el panel y validar que sólo se escribe a registros con consentimiento activo.
6. Probar un registro público duplicado con el mismo correo: debe reenviar correo, sin elevar consentimiento ni enviar SMS.

## Operación del equipo

- Usar **Reenviar SMS** sólo cuando el panel muestra consentimiento y la persona no está suprimida.
- Usar **Copiar SMS** sólo en un canal autorizado por la persona.
- Usar **Marcar SMS manual** únicamente después de haberlo enviado.
- Nunca quitar una supresión `STOP` desde el panel. La persona debe responder `START` desde su propio teléfono antes de volver a contactarla.
