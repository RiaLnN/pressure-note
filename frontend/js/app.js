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
        const user = tg.initDataUnsafe.user || {id: 1297964385, username: "dev", language_code: "ua"};
        const responseData = await UserData.create(user.id.toString());
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        SettingsManager.saveSettings({ timezone: userTimezone });
        AppState.token = responseData.access_token;
        AppState.user.settings.language_code = user.language_code;
        AppState.user.username = user.username;
    } catch (e) {console.error(e.message)};
    await I18nManager.init();
    await CalendarManager.initPreview();
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
    MeasurementsManager.init();
    ActionHandler.init();
    MeasurementsManager.fetchAndRefresh();
    SettingsManager.fetchAndRefresh();
    document.body.style.overscrollBehavior = 'none';
}
init();