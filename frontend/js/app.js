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
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await SettingsManager.fetchAndRefresh();
        AppState.token = responseData.access_token;
        AppState.user.username = user.username;
        
        await I18nManager.init();
        await SettingsManager.saveSettings({ timezone: userTimezone });
        await CalendarManager.initPreview();
        MeasurementsManager.init();
        ActionHandler.init();
        await MeasurementsManager.fetchAndRefresh();
    } catch (e) {console.error(e.message)};

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