import api from '../api/axios';// Adjust the import path based on your project structure
import { VisitOption } from '../types/visitOption';
import axios, { AxiosResponse } from 'axios';

export const VisitOptionService = {
    createVisitOption: async (visitOption: VisitOption, image?: File): Promise<VisitOption> => {
        const formData = new FormData();
        formData.append('visitOption', JSON.stringify(visitOption));
        console.log(formData)
        if (image) {
            formData.append('image', image);
        }

        const response: AxiosResponse<VisitOption> = await api.post('/api/visit-options/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },


    // Get a visit option by ID
    getVisitOptionById: async (id: number): Promise<VisitOption> => {
        const response: AxiosResponse<VisitOption> = await api.get(`/api/visit-options/get/${id}`);
        return response.data;
    },

    // Get all visit options
    getAllVisitOptions: async (): Promise<VisitOption[]> => {
        const response: AxiosResponse<VisitOption[]> = await api.get('/api/visit-options/all');
        return response.data;
    },

    // Get visit options by visit type ID
    getVisitOptionsByVisitType: async (visitTypeId: number): Promise<VisitOption[]> => {
        const response: AxiosResponse<VisitOption[]> = await api.get(`/api/visit-options/by-visit-type/${visitTypeId}`);
        return response.data;
    },
    // Get visit options by visit type ID
    getActiveOptionsByType: async (visitTypeId: number): Promise<VisitOption[]> => {
        const response: AxiosResponse<VisitOption[]> = await api.get(`/api/visit-options/activeByType/${visitTypeId}`);
        return response.data;
    },

    getAllPreRegActiveOptionsByType: async (visitTypeId: number): Promise<VisitOption[]> => {
        try {
            const response: AxiosResponse<VisitOption[]> = await api.get(
                `/api/visit-options/getAllPreRegActiveOptionsByType/${visitTypeId}`
            );
            return response.data;
        } catch (error) {
            // Handle different types of errors appropriately
            if (axios.isAxiosError(error)) {
                // Axios-specific error (network error, 4xx/5xx response)
                if (error.response) {
                    // Server responded with a status code outside 2xx range
                    console.error(
                        `Request failed with status ${error.response.status}:`,
                        error.response.data
                    );
                    throw new Error(
                        error.response.data.message ||
                        `Failed to fetch visit options. Status: ${error.response.status}`
                    );
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('No response received:', error.request);
                    throw new Error('Network error - no response received from server');
                } else {
                    // Something happened in setting up the request
                    console.error('Request setup error:', error.message);
                    throw new Error(`Failed to setup request: ${error.message}`);
                }
            } else {
                // Non-Axios error
                console.error('Unexpected error:', error);
                throw new Error('An unexpected error occurred while fetching visit options');
            }
        }
    },

    // Update a visit option
    updateVisitOption: async (visitOption: VisitOption, image?: File): Promise<VisitOption> => {
        const formData = new FormData();
        formData.append('visitOption', JSON.stringify(visitOption));
        if (image) {
            formData.append('image', image);
        }

        const response: AxiosResponse<VisitOption> = await api.put('/api/visit-options/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete a visit option
    deleteVisitOption: async (id: number): Promise<void> => {
        await api.delete(`/api/visit-options/delete/${id}`);
    },

    // Get image by filename
    getImage: async (filename: string): Promise<Blob> => {
        const response: AxiosResponse<Blob> = await api.get(`/api/visit-options/cover/${filename}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Delete image by filename
    deleteImage: async (filename: string): Promise<VisitOption> => {
        const response: AxiosResponse<VisitOption> = await api.delete(`/api/visit-options/delete/cover/${filename}`);
        return response.data;
    },
};