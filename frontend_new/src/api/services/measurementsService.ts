import { api } from '../instance';
import type {
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
};

