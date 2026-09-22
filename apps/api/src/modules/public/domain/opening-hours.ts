export interface OpeningHours {
  openMinutes: number
  closeMinutes: number
}

export const DEFAULT_OPENING_HOURS: OpeningHours = {
  openMinutes: 9 * 60,
  closeMinutes: 19 * 60,
}

const BUSINESS_HOURS_REGEX = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/

// Salon.businessHours é texto livre (ex.: "09:00-19:00"). Quando o formato não bate,
// cai pro horário padrão em vez de recusar a disponibilidade inteira.
export function parseBusinessHours(businessHours?: string | null): OpeningHours {
  if (!businessHours) return DEFAULT_OPENING_HOURS

  const match = BUSINESS_HOURS_REGEX.exec(businessHours.trim())
  if (!match) return DEFAULT_OPENING_HOURS

  const [, openH, openM, closeH, closeM] = match
  const openMinutes = Number(openH) * 60 + Number(openM)
  const closeMinutes = Number(closeH) * 60 + Number(closeM)

  if (closeMinutes <= openMinutes) return DEFAULT_OPENING_HOURS

  return { openMinutes, closeMinutes }
}
