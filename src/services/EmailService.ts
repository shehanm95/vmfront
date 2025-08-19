import { AxiosError, AxiosResponse } from 'axios';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../types/ApiErrorResonse';
import { OptChecker } from '../types/OptChecker';

const API_BASE_URL = '/mail';

export class EmailService {

    async resendOpt(email: string): Promise<void> {
        try {
            await api.get(`${API_BASE_URL}/resendOpt/${email}`);
            toast.success('Verification code sent successfully.');
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorMessage = err.response?.data?.message || "Failed to send authentication code.";
            toast.error(errorMessage);
            console.error('Error:', errorMessage);
            throw new Error(errorMessage);
        }
    }

    async checkOpt(optChecker: OptChecker): Promise<void> {
        try {
            await api.post(`${API_BASE_URL}/checkOpt`, optChecker);
            toast.success('Verification successful.');
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorMessage = err.response?.data?.message || "Invalid authentication code.";
            toast.error(errorMessage);
            console.error('Error:', errorMessage);
            throw new Error(errorMessage);
        }
    }
}
