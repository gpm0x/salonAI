import type { OpeningHours } from "./opening-hours"

export interface BookedInterval {
  startsAt: Date
  endsAt: Date
}

export interface AvailableSlot {
  startsAt: Date
  endsAt: Date
}

interface GenerateSlotsParams {
  /** Meia-noite do dia consultado, no fuso do processo (mesma convenção usada em appointments). */
  dayBase: Date
  hours: OpeningHours
  durationMinutes: number
  bookedIntervals: BookedInterval[]
  /** Slots com inicio antes de `now` sao excluidos (usado só quando o dia consultado é hoje). */
  now?: Date
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart
}

// Gera os slots de horario disponiveis pra um dia, com granularidade = duracao do servico,
// excluindo horarios que colidem com agendamentos existentes (bookedIntervals) e horarios passados.
export function generateAvailableSlots(params: GenerateSlotsParams): AvailableSlot[] {
  const { dayBase, hours, durationMinutes, bookedIntervals, now } = params
  const step = durationMinutes > 0 ? durationMinutes : 30
  const slots: AvailableSlot[] = []

  for (let minutes = hours.openMinutes; minutes + step <= hours.closeMinutes; minutes += step) {
    const startsAt = new Date(dayBase)
    startsAt.setMinutes(startsAt.getMinutes() + minutes)
    const endsAt = new Date(startsAt)
    endsAt.setMinutes(endsAt.getMinutes() + step)

    if (now && startsAt < now) continue

    const conflict = bookedIntervals.some((b) => overlaps(startsAt, endsAt, b.startsAt, b.endsAt))
    if (conflict) continue

    slots.push({ startsAt, endsAt })
  }

  return slots
}
