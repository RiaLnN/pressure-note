import { tg } from "./config.js";
import { AppState } from "./state.js";
import { MeasurementsManager } from "./managers/measurements.js";
import {  UserData } from "./api.js"
import { ActionHandler } from "./ui.js";
import { SettingsManager } from "./managers/settings.js";

async function init() {
    tg.ready();
    try {
        const user = tg.initDataUnsafe.user || {id: 1297964385, username: "dev"};
        const responseData = await UserData.create(user.id.toString());
        AppState.token = responseData.access_token;
    } catch (e) {console.error(e.message)};
    MeasurementsManager.init();
    ActionHandler.init();
    MeasurementsManager.fetchAndRefresh();
    SettingsManager.fetchAndRefresh();
}
init();