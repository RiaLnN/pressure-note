import { measurementsApi } from "../api.js";
import { UIManager } from "../ui.js";
import { Measurement } from "../types/types.js";


type DayData = {
    date: Date;
    is_current_month?: boolean;
    measurements: Measurement[];
    average: number;
}

interface CalendarStats {
    year: number;
    month: number;
    average: number;
    days: DayData[];
}

interface ICalendarManager {
    currentDate: Date;
    monthlyData: DayData[];
    weeklyData: DayData[];
    init(): Promise<void>;
    initPreview(): Promise<void>;
    nextMonth(): void;
    prevMonth(): void;
}

export const CalendarManager: ICalendarManager = {
    currentDate: new Date(),
    monthlyData: [],
    weeklyData: [],
    async init() {
        const data: CalendarStats = await measurementsApi.getByMonth(this.currentDate);
        this.monthlyData = data.days;
        UIManager.loadCalendar(data);
    },
    async initPreview() {
        const data: CalendarStats = await measurementsApi.getWeek(this.currentDate);
        this.weeklyData = data.days;
        UIManager.renderCalendarPreview(data);
    },
    nextMonth() {
        const next = new Date(this.currentDate);
        next.setMonth(next.getMonth() + 1);
        this.currentDate = next;
        this.init();
    },
    prevMonth() {
        const next = new Date(this.currentDate);
        next.setMonth(next.getMonth() - 1);
        this.currentDate = next;
        this.init();
    }
};