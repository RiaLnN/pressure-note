import { measurementsApi } from "../api.js";
import { UIManager } from "../ui.js";
import { tg } from "../config.js"
import { Measurement } from "../types/types.js";

interface HistoryData {
    date: Date;
    measurements: Measurement[];
}


export const HistoryManager = {
    async loadHistory() {
        try {
            const history: HistoryData = await measurementsApi.getHistory();
            UIManager.renderHistory(history);
        } catch (error) {
            console.error(error);
            tg.showAlert("Load falied!");
        }
    }
}