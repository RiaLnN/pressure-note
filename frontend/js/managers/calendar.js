import { AppState } from "../store.js";
import { PRESSURE } from "../helpers/pressureLevels.js";
import { measurementsApi } from "../api.js";

export const CalendarManager = {
    currentDate: new Date(),
    monthlyData: [],
    async init() {
        this.currentDate = new Date();
        await this.loadMonthData();
        this.render();
    },

    async changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        await this.loadMonthData();
        this.render();
    },

    async loadMonthData() {
        const year = this.currentDate.getFullYear();
        const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const period = `${year}-${month}`;
        

        this.monthlyData = await measurementsApi.getCalendar(period); 
    },

    getHealthScoreForDay(dateString) {
        const dayData = this.monthlyData.find(d => d.date === dateString);
        if (!dayData || !dayData.measurements.length) return null;

        const avg = PRESSURE.getAveragePressure(dayData.measurements);
        return PRESSURE.calculateHealthScore(avg.sys, avg.dia, AppState.targetPressure);
    },

    getIndicatorClass(score) {
        if (score === null) return '';
        if (score >= 80) return 'calendar__day-indicator--high';
        if (score >= 60) return 'calendar__day-indicator--elevated';
        if (score >= 40) return 'calendar__day-indicator--good';
        return 'calendar__day-indicator--low';
    },

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const monthName = this.currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('calendar-month').textContent = monthName;

        const daysContainer = document.getElementById('calendar-days');
        daysContainer.innerHTML = '';

        let firstDayIndex = new Date(year, month, 1).getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6; 

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'calendar__day calendar__day--empty';
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const score = this.getHealthScoreForDay(dateString);
            
            const btn = document.createElement('button');
            btn.className = 'calendar__day';
            btn.dataset.action = 'select-date'; 
            btn.dataset.date = dateString;

            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                btn.classList.add('calendar__day--today');
            }

            let indicatorHtml = '';
            if (score !== null) {
                const indicatorClass = this.getIndicatorClass(score);
                indicatorHtml = `<span class="calendar__day-indicator ${indicatorClass}"></span>`;
            }

            btn.innerHTML = `
                <span class="calendar__day-number">${i}</span>
                ${indicatorHtml}
            `;
            daysContainer.appendChild(btn);
        }
    },

    renderDayInfo(dateString) {
        const infoContainer = document.getElementById('calendar-info');
        const dayData = this.monthlyData.find(d => d.date === dateString);

        if (!dayData || !dayData.measurements.length) {
            infoContainer.innerHTML = `
                <h3 class="calendar-info__title">No measurements</h3>
                <p class="calendar-info__empty">No data for ${dateString}</p>
            `;
            return;
        }

        const avg = PRESSURE.getAveragePressure(dayData.measurements);
        
        infoContainer.innerHTML = `
            <h3 class="calendar-info__title">Average for ${dateString}</h3>
            <div class="stat-card">
                <span class="stat-card__value">${avg.sys}/${avg.dia}</span>
                <span class="stat-card__subtitle">Based on ${dayData.measurements.length} measurements</span>
            </div>
        `;
    }
};