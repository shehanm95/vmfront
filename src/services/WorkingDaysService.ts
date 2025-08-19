import { AxiosError, AxiosResponse } from 'axios';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../types/ApiErrorResonse';
import { WorkingDay } from '../types/WorkingDay';

const API_BASE_URL = '/workingDays';

export class WorkingDaysService {
    async getAll(): Promise<WorkingDay[]> {
        try {
            const response: AxiosResponse<WorkingDay[]> = await api.get(`${API_BASE_URL}/getAll`);
            return response.data ?? [];
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    async setAll(workingDays: WorkingDay[]): Promise<WorkingDay[]> {
        try {
            const response: AxiosResponse<WorkingDay[]> = await api.post(`${API_BASE_URL}/setAll`, workingDays);
            return response.data ?? [];
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    private handleError(error: unknown): void {
        const err = error as AxiosError<ApiErrorResponse>;
        const errorMessage = err.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
        console.error('Error:', errorMessage);
        throw new Error(errorMessage);
    }
}

