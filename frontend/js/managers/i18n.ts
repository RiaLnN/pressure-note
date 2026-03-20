import { AppState } from "../state.js";

type LocaleData = Record<string, any>;

interface II18nManager {
    locale: LocaleData;
    init(): Promise<void>;
    t(key: string | undefined): string;
    translatePage(): void;
}

export const I18nManager: II18nManager = {
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
    t(key: string | undefined): string {
        if (!key) return '';
        return key.split('.').reduce((obj: any, i: string) => {
            return (obj && obj[i] !== undefined) ? obj[i] : key;
        }, this.locale);
    },
    translatePage() {
        document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        })
        document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach( el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        })
    }
}