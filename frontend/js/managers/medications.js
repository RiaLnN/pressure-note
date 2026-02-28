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
            tg.showAlert("Save failed");
            return false;
        }
    },
    async deleteMedication(id){
        try {
            await MedicationApi.delete(id);
            tg.HapticFeedback.notificationOccurred('success');
            return true;
        } catch (error) {
            console.error(error);
            tg.showAlert("Deleting failed");
            return false;
        }
    },
    async updateMedication(id, data){
        try {
            await MedicationApi.update(id, data);
            tg.HapticFeedback.notificationOccurred('success');
            return true;
        } catch (error) {
            console.error(error);
            tg.showAlert("Updating failed");
            return false;
        }
    },
    async getItemData(id){
        const data = await MedicationApi.getById(id);
        data.reminders.forEach((reminder) => this.currentReminders.push(reminder));
        UIManager.loadEditScreen(data);
    },
    async getData(medId=null){
        const itemContainter = document.getElementById("medication-input");
        const itemName = itemContainter.value;
        if (!itemName || this.currentReminders.length === 0) {
            return tg.showAlert("Fill name and add at least one time");
        }

        const payload = {
            item_name: itemName,
            reminders: this.currentReminders
        };
        let success;
        if (!medId) {
            success = await this.saveMedication(payload);
        } else {
            success = await this.updateMedication(medId, payload);
        }
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