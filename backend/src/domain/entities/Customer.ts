/**
 * Customer Entity
 * Maps to: customers table
 */
export interface Customer {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  document_type?: string | null;
  document_number?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country: string;
  notes?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface CreateCustomerDTO {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  document_type?: string;
  document_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  created_by?: number;
}

export interface UpdateCustomerDTO {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  document_type?: string;
  document_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  is_active?: boolean;
  updated_by?: number;
}
