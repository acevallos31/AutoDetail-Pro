import { api } from '../../../shared/api/client';
import type {
  Service,
  CreateServiceDTO,
  UpdateServiceDTO,
  GetServicesParams,
  ServicePriceHistory,
  CalculateTotalRequest,
  CalculateTotalResponse,
} from '../types/service.types';

const SERVICES_BASE_PATH = '/services';

/**
 * Services API service
 * Handles all CRUD operations for services
 */
export const servicesApi = {
  /**
   * Get all services with optional category filter
   */
  getAll: async (params?: GetServicesParams): Promise<Service[]> => {
    const queryParams = params?.category_id ? `?category_id=${params.category_id}` : '';
    const response = await api.get<Service[]>(`${SERVICES_BASE_PATH}${queryParams}`);
    return response.data || [];
  },

  /**
   * Get a single service by ID
   */
  getById: async (id: number): Promise<Service | null> => {
    try {
      const response = await api.get<Service>(`${SERVICES_BASE_PATH}/${id}`);
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new service
   */
  create: async (data: CreateServiceDTO): Promise<Service> => {
    const response = await api.post<Service>(SERVICES_BASE_PATH, data);
    if (!response.data) {
      throw new Error('Failed to create service');
    }
    return response.data;
  },

  /**
   * Update an existing service
   */
  update: async (id: number, data: UpdateServiceDTO): Promise<Service> => {
    const response = await api.patch<Service>(`${SERVICES_BASE_PATH}/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update service');
    }
    return response.data;
  },

  /**
   * Delete (deactivate) a service
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`${SERVICES_BASE_PATH}/${id}`);
  },

  /**
   * Get price history for a service
   */
  getPriceHistory: async (id: number): Promise<ServicePriceHistory[]> => {
    const response = await api.get<ServicePriceHistory[]>(`${SERVICES_BASE_PATH}/${id}/price-history`);
    return response.data || [];
  },

  /**
   * Calculate total price for multiple services
   */
  calculateTotal: async (data: CalculateTotalRequest): Promise<CalculateTotalResponse> => {
    const response = await api.post<CalculateTotalResponse>(`${SERVICES_BASE_PATH}/calculate-total`, data);
    if (!response.data) {
      throw new Error('Failed to calculate total');
    }
    return response.data;
  },
};
