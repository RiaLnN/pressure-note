import { tg } from "../config.js"
import { AppState } from "../state.js";

export const I18nManager = {
    locale: {},

    async init() {
        try {
            const response = await fetch(`frontend/js/locales/${AppState.user.settings.language_code}.json`);
            if (!response.ok) throw new Error("Locale not found");
            this.locale = await response.json();
        } catch (e) {
            const response = await fetch(`frontend/js/locales/en.json`);
            this.locale = await response.json();
        }
        this.translatePage();
    },
    t(key) {
        return key.split('.').reduce((obj, i) => (obj ? obj[i] : key), this.locale);
    },
    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        })
        document.querySelectorAll('[data-i18n-placeholder]').forEach( el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        })
    }
}