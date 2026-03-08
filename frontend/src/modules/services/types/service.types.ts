// Service entity types
export interface Service {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  estimated_duration_minutes: number;
  category_id: number;
  requires_booth: boolean;
  requires_drying: boolean;
  can_be_parallel: boolean;
  is_active: boolean;
  version_number: number;
  effective_from: string;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  category_name?: string;
  category_description?: string;
  category?: ServiceCategory;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

// DTO types for API requests
export interface CreateServiceDTO {
  name: string;
  description?: string;
  base_price: number;
  estimated_duration_minutes: number;
  category_id: number;
  requires_booth?: boolean;
  requires_drying?: boolean;
  can_be_parallel?: boolean;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  base_price?: number;
  estimated_duration_minutes?: number;
  category_id?: number;
  requires_booth?: boolean;
  requires_drying?: boolean;
  can_be_parallel?: boolean;
  is_active?: boolean;
}

// Query params
export interface GetServicesParams {
  category_id?: number;
}

// Price history
export interface ServicePriceHistory {
  id: number;
  service_id: number;
  old_price: number;
  new_price: number;
  changed_by: number;
  changed_at: string;
  reason: string | null;
}

// Calculate total types
export interface CalculateTotalRequest {
  serviceIds: number[];
  quantities: number[];
}

export interface CalculateTotalResponse {
  subtotal: number;
  services: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
}
