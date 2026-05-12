import axios from 'axios';
import { API_BASE_URL } from '../config';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
    const tgInitData =
        (globalThis as any)?.Telegram?.WebApp?.initData;


    if (typeof tgInitData === 'string') {
        config.headers = config.headers ?? {};
        (config.headers as any)['X-Telegram-Init-Data'] = tgInitData;
    }

    return config;
});
api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';