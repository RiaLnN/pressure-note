import { MedicationApi } from "../api.js"
import { tg } from "../config.js";
import { UIManager } from "../ui.js";

export const MedicationManager = {
    currentReminders: [],

    async fetchAndRefresh() {
        const data = await MedicationApi.get();
        UIManager.loadMedication(data);
    },
    async saveMedication(data) {
        try {
            await MedicationApi.create(data);
            tg.HapticFeedback.notificationOccurred('success');
            return true;
        } catch (error) {
            console.error(error);
            tg.showAlert("Save failed")
        }
    },
    async getData(){
        const itemContainter = document.getElementById("medication-input");
        const itemName = itemContainter.value;
        if (!itemName || this.currentReminders.length === 0) {
            return tg.showAlert("Fill name and add at least one time");
        }

        const payload = {
            item_name: itemName,
            reminders: this.currentReminders
        };
        const success = await this.saveMedication(payload);
        if (success) {
            itemContainter.value = "";
            this.currentReminders = [];
            UIManager.renderChips(this.currentReminders);
            UIManager.switchView("medications-screen");
            this.fetchAndRefresh();
        }
    },
    addReminder(time){
        if (time && !this.currentReminders.includes(time)){
            this.currentReminders.push(time);
            UIManager.renderChips(this.currentReminders);
        }
    },
    deleteReminder(time){
        this.currentReminders = this.currentReminders.filter(t => t !== time);
        UIManager.renderChips(this.currentReminders);
    }
}