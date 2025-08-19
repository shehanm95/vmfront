import api from '../api/axios'; // Adjust the import path based on your project structure
import { VisitType } from '../types/visitType';
import { AxiosResponse } from 'axios';

export const VisitTypeService = {
    // Create a new visit type
    createVisitType: async (visitType: VisitType, image?: File): Promise<VisitType> => {
        const formData = new FormData();
        formData.append('visitType', JSON.stringify(visitType));
        if (image) {
            formData.append('image', image);
        }

        const response: AxiosResponse<VisitType> = await api.post('/api/visit-types/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get a visit type by ID
    getVisitTypeById: async (id: number): Promise<VisitType> => {
        const response: AxiosResponse<VisitType> = await api.get(`/api/visit-types/${id}`);
        return response.data;
    },

    // Get all visit types
    getAllVisitTypes: async (): Promise<VisitType[]> => {
        const response: AxiosResponse<VisitType[]> = await api.get('/api/visit-types/all');
        return response.data;
    },

    // Get all PREREG visit types
    getAllPreRegVisitTypes: async (): Promise<VisitType[]> => {
        const response: AxiosResponse<VisitType[]> = await api.get('/api/visit-types/allPreRegTypes');
        return response.data;
    },

    visitTypesWithPreRegistration: async (): Promise<VisitType[]> => {
        const response: AxiosResponse<VisitType[]> = await api.get('/api/visit-types/visitTypesWithPreRegistration');
        return response.data;
    },

    // Update a visit type
    updateVisitType: async (visitType: VisitType, image?: File): Promise<VisitType> => {
        const formData = new FormData();
        formData.append('visitType', JSON.stringify(visitType));
        if (image) {
            formData.append('image', image);
        }

        const response: AxiosResponse<VisitType> = await api.put('/api/visit-types/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete a visit type
    deleteVisitType: async (id: number): Promise<void> => {
        await api.delete(`/api/visit-types/${id}`);
    },

    // Get image by filename
    getImage: async (filename: string): Promise<Blob> => {
        const response: AxiosResponse<Blob> = await api.get(`/api/visit-types/cover/${filename}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Delete image by filename
    deleteImage: async (filename: string): Promise<VisitType> => {
        const response: AxiosResponse<VisitType> = await api.delete(`/api/visit-types/cover/delete/${filename}`);
        return response.data;
    },
};