import axios from "axios";

export const BASE_URL =  'https://proconnect-9m19.onrender.com/'

export const clientServer = axios.create({
    baseURL: BASE_URL
})