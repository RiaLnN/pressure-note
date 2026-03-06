import { UserData } from "../api.js";
import { tg } from "../config.js";
import { AppState } from "../state.js";
import { UIManager } from "../ui.js";

export const SettingsManager = {
    async fetchAndRefresh() {
        try {
            const user =  await UserData.getUser();
            const userSettings = user.settings;
            AppState.settings = userSettings;
            UIManager.loadSettings(userSettings);
            UIManager.loadSettingsScreen();
        } catch(error) {
            console.error(error);
        }
    },
    async saveSettings(settings) {
        try {
            await UserData.update(settings);
            tg.HapticFeedback.notificationOccurred('success');
            return true;
        } catch (error) {
            console.error(error);
            tg.showAlert("Failed");
            return false;
        }
    },
    async targetPressure(){
        const sys = document.getElementById("target-sys").value;
        const dia = document.getElementById("target-dia").value;
        const success =  await this.saveSettings({settings: { target_pressure: {sys, dia} }});
        if (success) this.fetchAndRefresh();
        else console.error("Load failed");
    },
    async updateNotification() {
        const toggle = document.getElementById("toggle-reminders").value;
        console.log(toggle);
        const success = await this.saveSettings({settings: { notifications: toggle === 'on' ? true : false}})
        if (success) this.fetchAndRefresh();
        else console.error("Load failed");
    },
    async updateReminders() {
        
        // const success = await this.saveSettings({settings: { notifications: toggle}})
        // if (success) this.fetchAndRefresh();
        // else console.error("Load failed");
    }
}