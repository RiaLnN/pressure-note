import { UserData } from "../api.js";
import { tg } from "../config.js";
import { AppState } from "../state.js";
import { UIManager } from "../ui.js";
import { I18nManager } from "./i18n.js";
import { measurementsApi } from "../api.js";

export const SettingsManager = {
    async fetchAndRefresh() {
        try {
            const user =  await UserData.getUser();
            const userSettings = user.settings;
            AppState.user.settings = { ...AppState.user.settings, ...userSettings };
            UIManager.loadSettings(userSettings);
            UIManager.loadSettingsScreen();

        } catch(error) {
            console.error(error);
        }
    },
    async saveSettings(newSettings) {
        try {
            await UserData.update({ settings: newSettings });
            
            AppState.user.settings = { ...AppState.user.settings, ...newSettings };
            
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            return true;
        } catch (error) {
            console.error(error);
            tg.showAlert("Failed to save settings");
            return false;
        }
    },
    async targetPressure(){
        const sys = document.getElementById("target-sys").value;
        const dia = document.getElementById("target-dia").value;
        const success =  await this.saveSettings({target_pressure: {sys, dia} });
        if (success) this.fetchAndRefresh();
        else console.error("Load failed");
    },
    async updateNotification(isChecked) {
        const success = await this.saveSettings({ notifications: isChecked });
        if (success) {
            await this.fetchAndRefresh();
        }
    },
    async addPressureReminder(time) {
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            tg.showAlert("Invalid format. Use HH:MM");
            return;
        }

        const currentReminders = AppState.user.settings.pressure_reminders || [];
        
        if (currentReminders.includes(time)) {
            tg.showAlert("This time is already added");
            return;
        }

        const newReminders = [...currentReminders, time].sort();
        const success = await this.saveSettings({ pressure_reminders: newReminders });
        
        if (success) {
            await this.fetchAndRefresh();
            UIManager.showRemindersModal();
        }
    },
    async deletePressureReminder(time) {
        const currentReminders = AppState.user.settings.pressure_reminders || [];
        const newReminders = currentReminders.filter(t => t !== time);
        
        const success = await this.saveSettings({ pressure_reminders: newReminders });
        
        if (success) {
            await this.fetchAndRefresh();
            UIManager.showRemindersModal();
        }
    },
    async clearData() {
        tg.showConfirm("Are you sure you want to delete ALL your measurements? This cannot be undone.", async (confirmed) => {
            if (confirmed) {
                try {
                    await measurementsApi.deleteAll(); 
                    tg.showAlert("Data cleared successfully");
                } catch (e) {
                    tg.showAlert("Failed to clear data");
                }
            }
        });
    },
    async changeLanguage(lang) {
        const success = await this.saveSettings({ language_code: lang });
        
        if (success) {
            AppState.user.settings.language_code = lang;
            await I18nManager.init();
            
            UIManager.loadSettingsScreen();
            
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        }
    }
}