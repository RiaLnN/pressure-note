import { measurementsApi } from "../api.js";
import { tg } from "../config.js";
import { AppState } from "../state.js";
import { UIManager } from "../ui.js";
import { CalendarManager } from "./calendar.js";

export const MeasurementsManager = {
    currentDate: new Date(),

    async fetchAndRefresh() {
        const data = await measurementsApi.getByDate(this.currentDate);
        if (!data) {
            UIManager.updateDashboard(null);
            return;
        }
        UIManager.updateDashboard(data);
    },
    async nextDay(){
        const now = new Date();
        if (now.toDateString() === this.currentDate.toDateString()) return;
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        await this.fetchAndRefresh();
    },
    async prevDay(){
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        await this.fetchAndRefresh();
    },
    async saveMeasurement(sys, dia, description = null) {
        try {
            const success = await measurementsApi.create({ sys, dia, created_at: this.currentDate, description });
            if (success) {
                await this.fetchAndRefresh();
                await CalendarManager.initPreview();
                tg.HapticFeedback.notificationOccurred('success');
                return true;
            }
        } catch (error) {
            tg.showAllert("Save failed!");
            return false;
        }
    },
    async init(){
        const quickAdd = document.querySelector('.quick-actions');
        quickAdd.addEventListener('click', async (event) => {
            const btn = event.target.closest('.quick-actions__btn');
            if (!btn) return;

            const sys = btn.dataset.sys;
            const dia = btn.dataset.dia;
            AppState.quickButtons = false;
            await this.saveMeasurement(Number(sys), Number(dia));
            
        });
    },
    async inputAdd(){
        const input = document.getElementById("pressure-input").value.trim();
        const noteInput = document.getElementById("note-input").value.trim();
        const [sys, dia] = input.split('/');
        if (noteInput) await this.saveMeasurement(Number(sys), Number(dia), noteInput);
        else await this.saveMeasurement(Number(sys), Number(dia));
    },
};