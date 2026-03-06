export const TimeConvert = {
    formatGroupDate(dateStr) {
        const d = new Date(dateStr);
        const today = new Date().toDateString();
        if (d.toDateString() === today) return "Today";
        
        return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
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
    }

}