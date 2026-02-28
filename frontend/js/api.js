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
    delete: (id) => request(`/measurements/${id}`, {
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