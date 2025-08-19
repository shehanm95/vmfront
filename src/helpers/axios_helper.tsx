import axios, { AxiosResponse } from 'axios';

export const getAuthToken = (): string | null => {
    return window.localStorage.getItem('auth_token');
};

export const setAuthHeader = (token: string | null): void => {
    if (token !== null) {
        window.localStorage.setItem('auth_token', token);
    } else {
        window.localStorage.removeItem('auth_token');
    }
};

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = <TResponse, TRequest = undefined>(
    method: string,
    url: string,
    data?: TRequest
): Promise<AxiosResponse<TResponse>> => {
    let headers: { Authorization?: string } = {};
    const authToken = getAuthToken();

    if (authToken !== null && authToken !== 'null') {
        headers = { Authorization: `Bearer ${authToken}` };
    }

    return axios({
        method,
        url,
        headers,
        data,
    });
};