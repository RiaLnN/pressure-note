import { PRESSURE } from "../helpers/pressureLevels.js";
import { measurementsApi } from "../api.js";
import { UIManager } from "../ui.js";

export const CalendarManager = {
    currentDate: new Date(),
    monthlyData: [],
    weeklyData: [],
    async init() {
        const data = await measurementsApi.getByMonth(this.currentDate);
        this.monthlyData = data.days;
        UIManager.loadCalendar(data);
    },
    async initPreview() {
        const data = await measurementsApi.getWeek(this.currentDate);
        this.weeklyData = data.days;
        UIManager.renderCalendarPreview(data);
    },
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.init();
    },
    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.init();
    }
};