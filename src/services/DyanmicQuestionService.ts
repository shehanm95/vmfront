import api from '../api/axios'; // adjust this path as needed
import { DynamicQuestion } from '../types/dynamicQuestion';
import { AxiosResponse } from 'axios';

export const DynamicQuestionService = {
    // Fetch all questions for a specific visit option
    getQuestionsByVisitOptionId: async (visitOptionId: number): Promise<DynamicQuestion[]> => {
        const response: AxiosResponse<DynamicQuestion[]> = await api.get(`/questions/visitOption/${visitOptionId}`);
        return response.data;
    },

    // Create a new dynamic question
    createQuestion: async (question: DynamicQuestion): Promise<DynamicQuestion> => {
        const response: AxiosResponse<DynamicQuestion> = await api.post('/questions/create', question);
        return response.data;
    },

    // Get a single question by ID
    getQuestionById: async (id: number): Promise<DynamicQuestion> => {
        const response: AxiosResponse<DynamicQuestion> = await api.get(`/questions/${id}`);
        return response.data;
    },

    // Update a dynamic question
    updateQuestion: async (question: DynamicQuestion): Promise<DynamicQuestion> => {
        const response: AxiosResponse<DynamicQuestion> = await api.put('/questions/update', question);
        return response.data;
    },

    // Delete a question by ID
    deleteQuestion: async (id: number): Promise<void> => {
        await api.delete(`/questions/delete/${id}`);
    },
};
