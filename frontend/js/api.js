import { CONFIG } from "./config.js";
import { AppState } from "./state.js";

async function request(endpoint, options = {}, initial = false) {
    const httpRequest = {
        headers: { 
            "Content-type": "application/json",
        },
        ...options
    }
    if (!initial && AppState.token) httpRequest.headers["Authorization"] = "Bearer " + AppState.token;

    const response = await fetch(`${CONFIG.baseUrl}${endpoint}`, httpRequest);
    if (response.status === 401) {
        AppState.token = null;
        // window.location.reload();
    }
    if (!response.ok) {
        throw new Error (`API error ${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json();
}

export const measurementsApi = {
    create: (data) => 
        request(`/measurements`, {
            method: "POST",
            body: JSON.stringify(data)
        }),
    getData: () => request(`/measurements`),
    getHistory: () => request(`/measurements/history`),
    getStats: (period) => request(`/stats?period=${period}`),
    getByMonth: (date) => {
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        return request(`/measurements/month/${yearMonth}`);
    },
    getByDate: (date) => {
        const yearMonthDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return request(`/measurements/day/${yearMonthDate}`);
    },
    getWeek: (date) => {
        const yearMonthDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return request(`/measurements/week/${yearMonthDate}`);
    },
    delete: (id) => request(`/measurements/id/${id}`, {
        method: "DELETE"
    }),
    deleteAll: () => request(`/measurements/all`, {
        method: "DELETE"
    }),
    update: (id, data) =>
        request(`/measurements/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        })
};

export const UserData = {
    create: (userId) => 
        request(`/users/auth/telegram`, {
            method: "POST",
            body: JSON.stringify(userId)
        }, true),
    update: (data) =>
        request(`/users`, {
            method: "PATCH",
            body: JSON.stringify(data)
        }),
    getUser: () => request(`/users`),
}

export const MedicationApi = {
    create: (data) =>
        request(`/medications`, {
            method: "POST",
            body: JSON.stringify(data)
        }),
    get: () => request(`/medications`),
    getById: (id) => request(`/medications/${id}`),
    update: (id, data) => request(`/medications/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    }),
    delete: (id) => request(`/medications/${id}`, {
        method: "DELETE"
    })
}