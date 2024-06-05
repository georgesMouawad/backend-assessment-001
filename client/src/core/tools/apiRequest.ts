import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3001";

export const sendRequest = async (method: string, route: string, body?: any) => {
    const response = await axios.request({
        method: method,
        url: route,
        data: body,
        headers: {
            Accept: "application/json",
        },
    });

    return response;
};

export const requestMethods = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
  };