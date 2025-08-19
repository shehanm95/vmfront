import { AxiosError, AxiosResponse } from 'axios';
import { ServicePoint } from '../types/ServicePoint';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../types/ApiErrorResonse';

const API_BASE_URL = '/api/service-points';

export class ServicePointService {
    async createServicePoint(servicePoint: Partial<ServicePoint>): Promise<ServicePoint> {
        try {
            const response: AxiosResponse<ServicePoint> = await api.post(API_BASE_URL, servicePoint);
            toast.success('Service point created successfully');
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to create service point');
            throw error;
        }
    }

    async getServicePointById(id: number): Promise<ServicePoint> {
        try {
            const response: AxiosResponse<ServicePoint> = await api.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to fetch service point');
            throw error;
        }
    }

    async getAllServicePoints(): Promise<ServicePoint[]> {
        try {
            const response: AxiosResponse<ServicePoint[]> = await api.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to fetch service points');
            throw error;
        }
    }

    async updateServicePoint(id: number, servicePoint: Partial<ServicePoint>): Promise<ServicePoint> {
        try {
            const response: AxiosResponse<ServicePoint> = await api.put(`${API_BASE_URL}/${id}`, servicePoint);
            toast.success('Service point updated successfully');
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to update service point');
            throw error;
        }
    }

    async deleteServicePoint(id: number): Promise<void> {
        try {
            await api.delete(`${API_BASE_URL}/${id}`);
            toast.success('Service point deleted successfully');
        } catch (error) {
            this.handleError(error, 'Failed to delete service point');
            throw error;
        }
    }

    async getServicePointsByStatus(status: string): Promise<ServicePoint[]> {
        try {
            const response: AxiosResponse<ServicePoint[]> = await api.get(`${API_BASE_URL}/status/${status}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to fetch service points by status');
            throw error;
        }
    }

    private handleError(error: unknown, defaultMessage: string): void {
        const err = error as AxiosError<ApiErrorResponse>;
        const errorMessage = err.response?.data?.message || defaultMessage;
        toast.error(errorMessage);
        console.error('Error:', errorMessage);
    }
}