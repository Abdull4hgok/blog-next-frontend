import axios from "axios";

export const axiosapi  =  axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        
       
        
    }
});
export const getToken=()=> {
    return localStorage.getItem('token');

}
export function setToken(token) {
    localStorage.setItem('token', token);

}

axiosapi.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);