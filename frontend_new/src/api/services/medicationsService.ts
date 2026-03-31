import { api } from "../instance";
import type { MedicationCreate, MedicationRead } from "../apiTypes";


export const MedicationsService = {
    create: async (payload: MedicationCreate) => {
        const { data } = await api.post<MedicationRead>('/medications', payload);
        return data;
    },
    list: async () => {
        const { data } = await api.get<MedicationRead[]>('/medications');
        return data;
    }
}