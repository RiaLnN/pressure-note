import { api } from '../instance';
import type {
  PressureCreate,
  PressureRead,
  PressureGroup,
  PressureGroupWeekly,
} from '../apiTypes';

export const MeasurementsService = {
  list: async () => {
    const { data } = await api.get<PressureRead[]>('/measurements');
    return data;
  },

  history: async (params: { limit: number }) => {
    const { data } = await api.get<PressureGroup[]>('/measurements/history', {
      params,
    });
    return data;
  },

  week: async (params: { date: string }) => {
    const { data } = await api.get<PressureGroupWeekly>(
      `/measurements/week/${params.date}`,
    );
    return data;
  },

  stats: async (params: { period: string }) => {
    const { data } = await api.get<PressureGroup[]>('/stats', {
      params,
    });
    return data;
  },

  create: async (payload: PressureCreate) => {
    const { data } = await api.post<PressureRead>('/measurements', payload);
    return data;
  },
};

