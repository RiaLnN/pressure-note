import { measurementsApi } from "../api.js";
import { UIManager } from "../ui.js";

export const HistoryManager = {
    async loadHistory() {
        try {
            const history = await measurementsApi.getHistory();
            UIManager.renderHistory(history);
        } catch (error) {
            console.error(error);
            tg.showAllert("Load falied!");
        }
    }
}