/**
 * El ÚNICO criterio de «hay página de reservas». Lo usan la pantalla (`/presupuesto`) y el correo
 * (`actions.ts`), leyendo los dos la misma variable por esta misma función: así no pueden decir cosas
 * distintas. Un valor vacío o de solo espacios —un desliz típico al pegar en el panel de Vercel—
 * cuenta como «no hay», y entonces nadie promete una reserva (spec `agenda-y-preparacion-de-llamadas`,
 * CA-04).
 */
export function normalizeBookingUrl(raw: string | undefined): string | null {
  return raw?.trim() || null
}
