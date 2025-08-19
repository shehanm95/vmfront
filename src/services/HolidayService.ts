import { AxiosError, AxiosResponse } from 'axios';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../types/ApiErrorResonse';

const API_BASE_URL = '/holiday';

export class HolidayService {
    async getAllHolidays(): Promise<HolidayDto[]> {
        try {
            const response: AxiosResponse<HolidayDto[]> = await api.get(API_BASE_URL);
            return response.data ?? [];
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    async getAllFutureHolidays(): Promise<HolidayDto[]> {
        try {
            const response: AxiosResponse<HolidayDto[]> = await api.get(`${API_BASE_URL}/future`);
            return response.data ?? [];
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    async getHolidaysByVisitOption(visitOptionId: number): Promise<HolidayDto[]> {
        try {
            const response: AxiosResponse<HolidayDto[]> = await api.get(`${API_BASE_URL}/visit-option/${visitOptionId}`);
            return response.data ?? [];
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    async getFutureHolidaysByVisitOption(visitOptionId: number): Promise<HolidayDto[]> {
        try {
            const response: AxiosResponse<HolidayDto[]> = await api.get(`${API_BASE_URL}/visit-option/${visitOptionId}/future`);
            return response.data ?? [];
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    async createHoliday(holidayDto: HolidayDto): Promise<HolidayDto | null> {
        try {
            const response: AxiosResponse<HolidayDto> = await api.post(API_BASE_URL, holidayDto);
            return response.data ?? null;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async updateHoliday(id: number, holidayDto: HolidayDto): Promise<HolidayDto | null> {
        try {
            const response: AxiosResponse<HolidayDto> = await api.put(`${API_BASE_URL}/${id}`, holidayDto);
            return response.data ?? null;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async deleteHoliday(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_BASE_URL}/${id}`);
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    async saveAll(holidays: HolidayDto[]): Promise<HolidayDto[]> {
        try {
            const response: AxiosResponse<HolidayDto[]> = await api.post(`${API_BASE_URL}/saveAll`, holidays);
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

// TODO: Define the HolidayDto interface based on your backend DTO
interface HolidayDto {
    id?: number;
    // Add other properties from your Java HolidayDto
}