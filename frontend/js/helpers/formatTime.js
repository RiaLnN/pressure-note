import { I18nManager } from "../managers/i18n.js";
import { AppState } from "../state.js";

export const TimeConvert = {
    formatGroupDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return I18nManager.t('history.today');
        } else if (date.toDateString() === yesterday.toDateString()) {
            return I18nManager.t('history.yesterday');
        } else {
            const day = date.getDate();
            const month = date.getMonth();
            const monthKey = [
                'january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'
            ][month];
            
            const monthName = I18nManager.t(`calendar.months.${monthKey}`);
            
            const lang = AppState.user.settings.language_code;
            return lang === 'en' ? `${monthName} ${day}` : `${day} ${monthName}`;
        }
    },
    formatTime(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    },
    formatMonth(dateStr){
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short' });
    },
    formatMonthFull(dateStr){
        const d = new Date();
        d.setMonth(dateStr-1);
        
        return d.toLocaleDateString('en-US', {month: 'long'});
    },
    getDay(dateStr){
        const d = new Date(dateStr);
        return d.getDate();
    },
    formatDateFull(dateStr){
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {year: 'numeric',month: '2-digit', day: '2-digit'});
    },
    formatMonthDate(dateStr){
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long'})
    },
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const monthKey = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ][month];
        
        const monthName = I18nManager.t(`calendar.months.${monthKey}`);
        const lang = AppState.user.settings.language_code;
        
        return lang === 'en' ? `${monthName} ${day}` : `${day} ${monthName}`;
    }

}