export interface PublicSalonServiceDTO {
  id: string
  name: string
  durationMinutes: number
  priceCents: number
}

export interface PublicSalonProfessionalDTO {
  id: string
  name: string
  avatarUrl: string | null
}

export interface PublicSalonDTO {
  id: string
  name: string
  slug: string
  address: string | null
  phone: string | null
  services: PublicSalonServiceDTO[]
  professionals: PublicSalonProfessionalDTO[]
}
