/**
 * Service Category Entity
 * Maps to: service_categories table
 */
export interface ServiceCategory {
  id: number;
  name: string;
  description?: string | null;
  display_order?: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: number | null;
  updated_by?: number | null;
}

/**
 * Service Entity
 * Maps to: services table
 */
export interface Service {
  id: number;
  name: string;
  description?: string | null;
  category_id: number;
  base_price: number; // DECIMAL(10,2)
  estimated_duration_minutes: number;
  requires_booth: boolean;
  requires_drying: boolean;
  can_be_parallel: boolean;
  is_active: boolean;
  version_number: number;
  effective_from: Date;
  effective_to?: Date | null;
  created_at: Date;
  updated_at: Date;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  category_id: number;
  base_price: number;
  estimated_duration_minutes: number;
  requires_booth?: boolean;
  requires_drying?: boolean;
  can_be_parallel?: boolean;
  created_by?: number;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  category_id?: number;
  base_price?: number;
  estimated_duration_minutes?: number;
  requires_booth?: boolean;
  requires_drying?: boolean;
  can_be_parallel?: boolean;
  is_active?: boolean;
  updated_by?: number;
}

/**
 * Service Price History Entity
 * Maps to: service_price_history table
 */
export interface ServicePriceHistory {
  id: number;
  service_id: number;
  old_price?: number | null;
  new_price: number;
  change_reason?: string | null;
  changed_at: Date;
  changed_by?: number | null;
}

/**
 * Service with Category (JOIN result)
 */
export interface ServiceWithCategory extends Service {
  category_name: string;
  category_description?: string | null;
}
