import { AxiosError, AxiosResponse } from 'axios';
import { SpecialNote } from '../types/SpecialNote';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../types/ApiErrorResonse';

const API_BASE_URL = '/api/special-notes';

export class SpecialNoteService {
    async createSpecialNote(specialNote: Partial<SpecialNote>): Promise<SpecialNote> {
        try {
            const response: AxiosResponse<SpecialNote> = await api.post(API_BASE_URL, specialNote);
            toast.success('Special note created successfully');
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to create special note');
            throw error;
        }
    }

    async getSpecialNoteById(id: number): Promise<SpecialNote> {
        try {
            const response: AxiosResponse<SpecialNote> = await api.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to fetch special note');
            throw error;
        }
    }

    async getAllSpecialNotes(): Promise<SpecialNote[]> {
        try {
            const response: AxiosResponse<SpecialNote[]> = await api.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to fetch special notes');
            throw error;
        }
    }

    async getNotesByServicePoint(servicePointId: number): Promise<SpecialNote[]> {
        try {
            const response: AxiosResponse<SpecialNote[]> = await api.get(`${API_BASE_URL}/service-point/${servicePointId}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to fetch notes by service point');
            throw error;
        }
    }

    async updateSpecialNote(id: number, specialNote: Partial<SpecialNote>): Promise<SpecialNote> {
        try {
            const response: AxiosResponse<SpecialNote> = await api.put(`${API_BASE_URL}/${id}`, specialNote);
            toast.success('Special note updated successfully');
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to update special note');
            throw error;
        }
    }

    async deleteSpecialNote(id: number): Promise<void> {
        try {
            await api.delete(`${API_BASE_URL}/${id}`);
            toast.success('Special note deleted successfully');
        } catch (error) {
            this.handleError(error, 'Failed to delete special note');
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