import { measurementsApi } from "../api.js";
import { tg } from "../config.js";
import { UIManager } from "../ui.js";
import { PRESSURE } from "../helpers/pressureLevels.js";

export const MeasurementsManager = {
    async fetchAndRefresh() {
        const data = await measurementsApi.getHistory();
        if (!data || data.length === 0) {
            UIManager.updateDashboard(null);
            return;
        }
        const lastMeasurement = PRESSURE.getAveragePressure(data[0].measurements);
        UIManager.updateDashboard(lastMeasurement, data[0].measurements.length);
    },
    async saveMeasurement(sys, dia) {
        try {
            const success = await measurementsApi.create({ sys, dia });
            if (success) {
                await this.fetchAndRefresh();
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
            await this.saveMeasurement(Number(sys), Number(dia));
        });
    },
    async inputAdd(){
        const input = document.getElementById("pressure-input").value.trim();
        const [sys, dia] = input.split('/');
        await this.saveMeasurement(Number(sys), Number(dia));
    },
};