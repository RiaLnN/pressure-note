import { measurementsApi } from "../api.js";
import { tg } from "../config.js";
import { AppState } from "../state.js";
import { UIManager } from "../ui.js";
import { CalendarManager } from "./calendar.js";

interface IMeasurementsManager {
    currentDate: Date;
    fetchAndRefresh(): Promise<void>;
    nextDay(): Promise<void>;
    prevDay(): Promise<void>;
    saveMeasurement(sys: number, dia: number, description: string | null): Promise<boolean>;
    init(): Promise<void>;
    inputAdd(): Promise<void>;
}

export const MeasurementsManager: IMeasurementsManager = {
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
    async saveMeasurement(sys: number, dia: number, description: string | null) {
        try {
            const success: boolean = await measurementsApi.create({ sys, dia, created_at: this.currentDate, description });
            if (success) {
                await this.fetchAndRefresh();
                await CalendarManager.initPreview();
                tg.HapticFeedback.notificationOccurred('success');
                return true;
            }
            return false;
        } catch (error) {
            tg.showAlert("Save failed!");
            return false;
        }
    },
    async init(){
        const quickAdd = document.querySelector<HTMLElement>('.quick-actions');
        if (!quickAdd) return;
        quickAdd.addEventListener('click', async (event) => {
            if (!(event.target instanceof Element)) return;
            const btn = event.target.closest<HTMLButtonElement>('.quick-actions__btn');
            if (!btn) return;

            const { sys, dia } = btn.dataset;
            if (!sys || !dia) return;
            AppState.quickButtons = false;
            await this.saveMeasurement(Number(sys), Number(dia), null);
            
        });
    },
    async inputAdd(){
        const inputContainer = document.getElementById("pressure-input") as HTMLInputElement;
        
        const noteInputContainer = document.getElementById("note-input") as HTMLInputElement;
        if (!inputContainer || !noteInputContainer) return;

        const input = inputContainer.value.trim();
        const noteInput = noteInputContainer.value.trim();

        const [sys, dia] = input.split('/');
        if (noteInput) await this.saveMeasurement(Number(sys), Number(dia), noteInput);
        else await this.saveMeasurement(Number(sys), Number(dia), null);
    },
};