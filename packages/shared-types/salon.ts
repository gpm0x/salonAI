export interface Salon {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  businessHours: string | null;
  totalChairs: number;
  isActive: boolean;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}
