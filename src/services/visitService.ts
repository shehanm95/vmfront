import { AxiosError, AxiosResponse } from 'axios';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../types/ApiErrorResonse';
import { Visit } from '../types/visit';
import { ObjectService } from '../frontServices/ObjectService';
import { VisitRowReq } from '../types/VisitRowReq';
import { VisitRow } from '../types/VisitRow';
import { VisitSearchObject } from '../components/dashboard/dashboardComponents/AllVisits';

const API_BASE_URL = '/visits';

export const VisitService = {

    async markAsPrinted(id: number): Promise<{ A: number }> {
        return await api.put(API_BASE_URL + "/markAsPrinted/" + id)
    },

    async getVisitRowsForDate(visitRawReq: VisitRowReq): Promise<VisitRow[]> {
        let o = ObjectService.removeBulk(visitRawReq, [])
        console.log(o)
        const response = await api.post(API_BASE_URL + "/getVisitRowsForDate", o);
        return response.data;
    },

    async createPreRegVisit(visit: Visit): Promise<Visit> {
        // let o = ObjectService.removeBulk(visitRawReq, [])
        // console.log(o)
        const response = await api.post(API_BASE_URL + "/createPreRegVisit", visit);
        return response.data;
    },


    async createVisit(visitData: Visit, photo: File | null | undefined): Promise<Visit | null> {
        try {
            const formData = new FormData();
            formData.append('visitDto', JSON.stringify(visitData));
            if (photo) {
                formData.append('image', photo);
            } else {
                toast.warn("you not uploaded a image")
            }

            const response: AxiosResponse<Visit> = await api.post(API_BASE_URL + "/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Visit created successfully');
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error creating visit');
            return null;
        }
    },

    async getVisitById(id: number): Promise<Visit | null> {
        try {
            const response: AxiosResponse<Visit> = await api.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error fetching visit');
            return null;
        }
    },

    async getAllVisits(pageLimit: number, pageNumber: number): Promise<Visit[]> {
        try {
            const response: AxiosResponse<Visit[]> = await api.get(`${API_BASE_URL}/all/${pageLimit}/${pageNumber}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error fetching all visits');
            return [];
        }
    },

    async getVisitsBySearchObj(pageLimit: number, pageNumber: number, searchObj: VisitSearchObject): Promise<Visit[]> {
        try {
            const response: AxiosResponse<Visit[]> = await api.post(`${API_BASE_URL}/getVisitsBySearchObj/${pageLimit}/${pageNumber}`, searchObj);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error fetching all visits');
            return [];
        }
    },

    async updateVisit(visitData: Visit): Promise<Visit | null> {
        try {
            const response: AxiosResponse<Visit> = await api.put(`${API_BASE_URL}/${visitData.id}`, visitData);
            toast.success('Visit updated successfully');
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error updating visit');
            return null;
        }
    },

    async deleteVisit(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_BASE_URL}/${id}`);
            toast.success('Visit deleted successfully');
            return true;
        } catch (error) {
            this.handleError(error, 'Error deleting visit');
            return false;
        }
    },

    async cancelVisit(id: number): Promise<Visit | null> {
        try {
            const response = await api.post(`${API_BASE_URL}/cancelVisit/${id}`);

            return response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;

            this.handleError(error, 'Error deleting visit');
            console.error("Error canceling visit:", error);
            return null;
        }
    },

    async getVisitsByVisitOptionId(visitOptionId: number): Promise<Visit[]> {
        try {
            const response: AxiosResponse<Visit[]> = await api.get(`${API_BASE_URL}/by-visit-option/${visitOptionId}`);
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error fetching visits by option');
            return [];
        }
    },

    async getVisitsByVisitorUserId(visitorUserId: number): Promise<Visit[]> {
        try {
            const response: AxiosResponse<Visit[]> = await api.get(`${API_BASE_URL}/by-visitor/${visitorUserId}`);
            console.log("fetcheed visits by user : ", response.data)
            return response.data;
        } catch (error) {
            this.handleError(error, 'Error fetching visits by visitor');
            return [];
        }
    },

    handleError(error: unknown, defaultMessage: string): void {
        const err = error as AxiosError<ApiErrorResponse>;
        const errorMessage = err.response?.data?.message || defaultMessage;
        //toast.error(errorMessage);
        console.error('API Error:', errorMessage, err.response?.data);
    }
}