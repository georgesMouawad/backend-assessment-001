import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3001";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendRequest = async (method: string, route: string, body?: any) => {
    try {
        const response = await axios.request({
            method: method,
            url: route,
            data: body,
            headers: {
                Accept: "application/json",
            },
            withCredentials: true,
        });

        return response;

    } catch (error) {
        console.log('Error Axios', error)
    }
};

export const requestMethods = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
};