export interface AvailabilitySlotDTO {
  startsAt: string
  endsAt: string
}

export interface AvailabilityResultDTO {
  slots: AvailabilitySlotDTO[]
}
