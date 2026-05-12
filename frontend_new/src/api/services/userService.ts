import { api } from "../instance";
import type { User, UpdateUser } from "../apiTypes";

export const UserService = {
    update: async (payload: UpdateUser) => {
        const { data } = await api.patch<User>('/users', payload);
        return data; 
    },
    get: async () => {
        const { data } = await api.get<User>('/users');
        return data;
    }
}