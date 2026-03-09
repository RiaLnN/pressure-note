import { tg } from "./config.js";
import { AppState } from "./state.js";
import { MeasurementsManager } from "./managers/measurements.js";
import {  UserData } from "./api.js"
import { ActionHandler } from "./ui.js";
import { SettingsManager } from "./managers/settings.js";
import { I18nManager } from "./managers/i18n.js";
import { CalendarManager } from "./managers/calendar.js";

async function init() {
    tg.ready();
    try {
        const user = tg.initDataUnsafe.user;
        const responseData = await UserData.create(user.id.toString());
        
        AppState.token = responseData.access_token;
        AppState.user.username = user.username;

        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log("LANGUAGE_CODE BEFORE SettingsManager.saveSettings({ timezone: userTimezone });     ", AppState.user.settings.language_code)
        await SettingsManager.saveSettings({ timezone: userTimezone });
        console.log("LANGUAGE_CODE AFTER SettingsManager.saveSettings({ timezone: userTimezone }); AND BEFORE SettingsManager.fetchAndRefresh();    ", AppState.user.settings.language_code)
        await SettingsManager.fetchAndRefresh(); 
        console.log("LANGUAGE_CODE AFTER SettingsManager.fetchAndRefresh();    ", AppState.user.settings.language_code)
        await I18nManager.init();
        console.log("LANGUAGE_CODE AFTER I18nManager.init();    ", AppState.user.settings.language_code)
        await CalendarManager.initPreview();
        console.log("LANGUAGE_CODE AFTER CalendarManager.initPreview();    ", AppState.user.settings.language_code)
        MeasurementsManager.init();
        ActionHandler.init();
        await MeasurementsManager.fetchAndRefresh();
        console.log("LANGUAGE_CODE AFTER MeasurementsManager.fetchAndRefresh()    ", AppState.user.settings.language_code)
        
    } catch (e) {
        console.error("Initialization error:", e);
    };

    tg.expand();
    tg.enableClosingConfirmation();
    
    // Set header color
    tg.setHeaderColor('#1a3829');
    
    // Set background color
    tg.setBackgroundColor('#1a1b23');
    
    // Add class to body
    document.body.classList.add('tg-viewport');
    
    // Apply theme colors to CSS variables
    if (tg.themeParams) {
        const root = document.documentElement;
        Object.entries(tg.themeParams).forEach(([key, value]) => {
            root.style.setProperty(`--tg-theme-${key.replace(/_/g, '-')}`, value);
        });
    }

    document.body.style.overscrollBehavior = 'none';
}
init();