import { MeasurementsManager } from "./managers/measurements.js";
import { PRESSURE } from "./helpers/pressureLevels.js";
import { HistoryManager } from "./managers/history.js";
import { TimeConvert } from "./helpers/formatTime.js";
import { StatisticsManager } from "./managers/stats.js";
import { CONFIG } from "./config.js";
import { SettingsManager } from "./managers/settings.js";
import { MedicationManager } from "./managers/medications.js";
import { CalendarManager } from "./managers/calendar.js";
import { AppState } from "./state.js";
import { I18nManager } from "./managers/i18n.js";
import { tg } from "./config.js";

export const UIManager = {
    screens: document.querySelectorAll(".screen"),
    navButtons: document.querySelectorAll(".nav__item"),
    chartInstance: null,
    globalNextDose: {
        time: '25:00',
        name: null
    },
    switchView(viewName) {
        this.screens.forEach(screen => {
            screen.classList.toggle("active", screen.classList.contains(viewName));
        });
        
        this.navButtons.forEach(btn => {
            btn.classList.toggle("nav__item--active", btn.dataset.page === viewName);
            
            if (btn.dataset.page === viewName) {
                btn.setAttribute("aria-current", "page");
            } else {
                btn.removeAttribute("aria-current");
            }
        });
    },
    showTargetModal() {
        const modal = document.getElementById('modal-target-pressure');
        const current = document.getElementById('target-pressure-value').textContent.split('/');
        document.getElementById('target-sys').value = current[0];
        document.getElementById('target-dia').value = current[1];

        modal.showModal();
    },
    closeTargetModal: () => document.getElementById('modal-target-pressure').close(),
    showRemindersModal() {
        const modal = document.getElementById('modal-reminders');
        const reminders = AppState.user.settings.pressure_reminders || [];
        const listContainer = document.getElementById('pressure-reminders-chips');

        if (reminders.length === 0) {
            listContainer.innerHTML = `<p class="empty-hint">No reminders set</p>`;
        } else {
            listContainer.innerHTML = reminders.map(r => `
                <div class="time-chip">
                    <span class="time-chip__text">${r}</span>
                    <span class="time-chip__remove" data-action="delete-reminder">&times;</span>
                </div>
            `).join('');
        }
        modal.showModal();
    },
    closeRemindersModal: () => document.getElementById('modal-reminders').close(),
    loadSettings(settings) {
        const targetPressure = settings.target_pressure;
        document.getElementById('target-pressure-value').textContent = `${targetPressure.sys}/${targetPressure.dia}`;
        this.closeTargetModal();
        MeasurementsManager.fetchAndRefresh();
    },
    updateDashboard (data) {
        const elements = {
            pressure: document.getElementById("current-pressure"),
            countHint: document.getElementById("measurement-count"),
            mainTitle: document.getElementById("current-date"),
            quickBtns: document.getElementById("quick-btns")
        };

        const statusManagedElements = [
            { el: document.getElementById("status-text"), prefix: "status__label--" },
            { el: document.querySelector(".status__circle"), prefix: "status__circle--" },
            { el: document.querySelector(".status__detail-value"), prefix: "status__detail-value--" }
        ];

        const allStatuses = ["none", "normal", "elevated", "high", "low"];

        elements.mainTitle.textContent = TimeConvert.formatMonthDate(data.date);
        elements.quickBtns.classList.toggle("active", !!AppState.quickButtons);

        statusManagedElements.forEach(({ el, prefix }) => {
            if (!el) return;
            const classesToRemove = allStatuses.map(s => `${prefix}${s}`);
            el.classList.remove(...classesToRemove);
        });
        
        if (!data.average) {
            elements.pressure.textContent = "--/--";
            elements.countHint.classList.remove("active");
            statusManagedElements.forEach(({ el, prefix }) => el.classList.add(`${prefix}none`));
            return;
        }

        const { sys, dia } = data.average;
        const count = data.measurements.length;
        const status = PRESSURE.getPressureStatus(sys, dia);
        const statusKey = status.name.toLowerCase();
        statusManagedElements[0].el.dataset.i18n = `status.${statusKey}`;
        elements.pressure.textContent = `${sys}/${dia}`;
        document.getElementById("status-text").textContent = I18nManager.t(`status.${statusKey}`);

        statusManagedElements.forEach(({ el, prefix }) => {
            el.classList.add(`${prefix}${statusKey}`);
        });

        const hasMeasurements = count > 0;
        elements.countHint.classList.toggle("active", hasMeasurements);
        if (hasMeasurements) {
            elements.countHint.textContent = I18nManager.t('status.measurements_count')
            .replace('{count}', count)
            .replace('{unit}', count === 1 ? I18nManager.t('common.measurement') : I18nManager.t('common.measurements'));
        }
    },
    renderHistory(groupedData) {
        const listContainer = document.getElementById("history-list");
        const emptyState = document.getElementById("history-empty");
        
        if (!groupedData || groupedData.length === 0) {
            listContainer.innerHTML = "";
            emptyState.style.display = "flex";
            return;
        }
        
        emptyState.style.display = "none";
        
        const html = groupedData.map(group => `
            <div class="history-group">
                <h3 class="history-group__title">${TimeConvert.formatGroupDate(group.date)}</h3>
                <div class="history-group__items">
                    ${group.measurements.map(m => {
                        const status = PRESSURE.getPressureStatus(m.sys, m.dia);
                        const statusClass = status.name.toLowerCase();
                        const statusLabel = I18nManager.t(`status.${statusClass}`);
                        
                        return `
                        <article class="history-item-section" data-id="${m.id}" data-status="${statusClass}">
                            <div class="history-item">
                                <div class="history-item__time">
                                    <span class="history-item__hour">${TimeConvert.formatTime(m.created_at)}</span>
                                    <span class="history-item__status-dot"></span>
                                </div>
                                <div class="history-item__content">
                                    <div class="history-item__pressure">
                                        <span class="history-item__value history-item__value--${statusClass}">
                                            ${m.sys}/${m.dia}
                                        </span>
                                        <span class="history-item__badge">${statusLabel}</span>
                                    </div>
                                </div>
                            </div>
                            ${m.description ? `
                                <div class="history-item__note">
                                    ${m.description}
                                </div>
                            ` : ''}
                        </article>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
    },

    updatePeriodButtons(activePeriod){
        const btns = document.querySelectorAll(".period-selector__btn");
        btns.forEach(btn => {
            btn.classList.toggle("period-selector__btn--active", btn.dataset.period === activePeriod);
        });
        StatisticsManager.loadStats(activePeriod);
    },
    renderStats(stats, period) {
        const contentBlock = document.getElementById("stats-content");
        const emptyState = document.getElementById("stats-empty");

        if (!stats) {
            contentBlock.style.display = "none";
            emptyState.style.display = "flex";
            return;
        }

        contentBlock.style.display = "block";
        emptyState.style.display = "none";
        const avgEl = document.getElementById('avg-pressure');
        avgEl.textContent = `${stats.avg.sys}/${stats.avg.dia}`;
        
        const maxEl = document.getElementById('max-pressure');
        maxEl.textContent = `${stats.max.sys}/${stats.max.dia}`;
        
        document.getElementById('max-date').textContent = TimeConvert.formatTime(stats.max.date); 
        
        const minEl = document.getElementById('min-pressure');
        minEl.textContent = `${stats.min.sys}/${stats.min.dia}`;

        document.getElementById('min-date').textContent = TimeConvert.formatTime(stats.min.date);

        document.getElementById('total-measurements').textContent = stats.total;
        const subtitles = { 'week': I18nManager.t("subtitles.week"), 'month': I18nManager.t("subtitles.month"), 'year': I18nManager.t("subtitles.year") };
        document.getElementById('period-subtitle').textContent = subtitles[period] || '';

        const distContainer = document.getElementById('distribution-bars');
        distContainer.innerHTML = stats.distribution.map(item => {
            
            return `
            <div class="distribution__bar">
                <span class="distribution__label" style="text-transform: capitalize;">${I18nManager.t(`status.${item.label.toLowerCase()}`)}</span>
                <div class="distribution__progress">
                    <div class="distribution__fill distribution__fill--${item.label}" style="width: ${item.perc}%"></div>
                </div>
                <span class="distribution__value">${item.perc}%</span>
            </div>
            `;
        }).join('');
    },
    renderChart(data) {
        const ctxEl = document.getElementById('statsChart');
        if (!ctxEl || !data || !data.length) return;
        
        const ctx = ctxEl.getContext('2d');
        if (this.chartInstance) this.chartInstance.destroy();

        const isMobile = window.innerWidth <= 375;
        const isSmallMobile = window.innerWidth <= 320;
        
        const dailyScores = data.map(day => {
            if (day.measurements.length === 0) return null;
            const avg = PRESSURE.getAveragePressure(day.measurements);
            return PRESSURE.calculateHealthScore(avg.sys, avg.dia);
        });

        const gradient = ctx.createLinearGradient(0, 0, 0, ctxEl.clientHeight);
        gradient.addColorStop(0, CONFIG.colors.red);
        gradient.addColorStop(0.3, CONFIG.colors.yellow); 
        gradient.addColorStop(0.5, CONFIG.colors.green); 
        gradient.addColorStop(0.8, CONFIG.colors.blue); 
        gradient.addColorStop(1, CONFIG.colors.darkBlue);
        
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.length === 12 
                    ? data.map(d => TimeConvert.formatMonth(d.date)) 
                    : data.map(d => TimeConvert.formatGroupDate(d.date)),
                datasets: [{
                    label: 'Pressure Range',
                    data: dailyScores, 
                    borderColor: gradient,
                    borderWidth: isMobile ? 3 : 4,
                    pointRadius: isMobile ? 3 : 4,
                    pointBorderColor: 'rgba(26, 56, 41, 1)',
                    pointBorderWidth: 2,
                    spanGaps: true,
                    fill: true,
                    tension: 0.4,
                    backgroundColor: (context) => {
                        const bg = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height);
                        bg.addColorStop(0, 'rgba(107, 203, 119, 0.15)');
                        bg.addColorStop(1, 'rgba(107, 203, 119, 0)');
                        return bg;
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: isMobile ? 20 : 30,
                        bottom: isMobile ? 5 : 10,
                        left: isMobile ? 5 : 10,
                        right: isMobile ? 5 : 10
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        border: { display: false },
                        grid: {
                            color: CONFIG.colors.gridLines,
                            drawTicks: false,
                            lineWidth: isMobile ? 0.5 : 1
                        },
                        ticks: {
                            stepSize: 25,
                            padding: isMobile ? 8 : 15,
                            color: CONFIG.colors.lightGreen,
                            font: { 
                                size: isSmallMobile ? 9 : isMobile ? 10 : 11,
                                weight: '600',
                                family: 'Inter'
                            },
                            callback: (val) => {
                                let label = '';
                                if (val === 50) label = I18nManager.t("status.normal");
                                if (val === 100) label = I18nManager.t("status.high");
                                if (val === 0) label = I18nManager.t("status.low");
                                return label ? label + (isMobile ? '' : '    ') : '';
                            }
                        }
                    },
                    x: {
                        offset: true,
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: CONFIG.colors.lightGreen,
                            padding: isMobile ? 5 : 10,
                            font: { 
                                size: isSmallMobile ? 8 : isMobile ? 9 : 10,
                                weight: '500'
                            },
                            maxRotation: 0,
                            autoSkip: true,
                            autoSkipPadding: isMobile ? 15 : 10
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(26, 56, 41, 0.95)',
                        titleColor: CONFIG.colors.lightGreen,
                        bodyColor: '#fff',
                        displayColors: false,
                        padding: isMobile ? 8 : 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: isMobile ? 11 : 13
                        },
                        bodyFont: {
                            size: isMobile ? 12 : 14
                        },
                        callbacks: {
                            label: (context) => {
                                const dayData = data[context.dataIndex];
                                if (!dayData?.measurements.length) return null;
                                const avg = PRESSURE.getAveragePressure(dayData.measurements);
                                return `Pressure: ${avg.sys}/${avg.dia}`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    },

    loadMedication(medications) {
        const listContainer = document.getElementById("medications-list");
        const emptyState = document.getElementById("medications-empty");
        const statusContainer = document.getElementById("next-dose-status");
        this.globalNextDose = { time: '25:00', name: null };
        if (!medications || medications.length === 0) {
            if (listContainer) listContainer.innerHTML = "";
            if (statusContainer) statusContainer.innerHTML = "";
            emptyState.style.display = "flex";
            return;
        }

        emptyState.style.display = "none";
        
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        medications.forEach(med => {
            const nextTime = med.reminders.sort().find(t => t >= currentTime);
            if (nextTime) {
                if (nextTime < this.globalNextDose.time){
                    this.globalNextDose = {
                        time: nextTime,
                        name: med.item_name
                    }
                }
            }
        });

        if (this.globalNextDose.name != null && this.globalNextDose.time != "25:00") {
            statusContainer.innerHTML = `
                <div class="status-banner__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="status-banner__info">
                    <span class="status-banner__label">${I18nManager.t("medications.next_dose")}:</span>
                    <span class="status-banner__value"><strong class="status-banner__value-name">${this.globalNextDose.name}</strong> ${I18nManager.t("medications.at")} ${this.globalNextDose.time}</span>
                </div>
            `;
            statusContainer.style.display = "flex";
        } else {
            statusContainer.innerHTML = `
                <div class="status-banner__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="status-banner__info">
                    <span class="status-banner__label">${I18nManager.t("medications.all_done")}</span>
                </div>
            `;
            statusContainer.style.display = "flex";
            this.globalNextDose.name = null;
            this.globalNextDose.time = "25:00";
            statusContainer.classList.add("status-banner--done");
        }
        const html = medications.map(medication => {
            const sortedReminders = [...medication.reminders].sort();
            
            const nextTimeIndex = sortedReminders.findIndex(t => t >= currentTime);
            const hasNextDose = nextTimeIndex !== -1;
            
            const takenCount = nextTimeIndex === -1 ? sortedReminders.length : nextTimeIndex;
            const totalCount = sortedReminders.length;
            const progressPerc = (takenCount / totalCount) * 100;
            return `
            <article class="medication-card ${!hasNextDose ? 'medication-card--completed' : ''}" id="med-${medication.item_name}" data-id="${medication.id}">
                <div class="medication-card__icon" data-action="mark">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M4.5 16.5C3 15 3 12.5 4.5 11L11 4.5C12.5 3 15 3 16.5 4.5L19.5 7.5C21 9 21 11.5 19.5 13L13 19.5C11.5 21 9 21 7.5 19.5L4.5 16.5Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M9 15L15 9" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <div class="medication-card__content">
                    <div class="medication-card__header">
                        <h3 class="medication-card__text">${medication.item_name}</h3>
                        <span class="medication-card__status">${takenCount}/${totalCount} ${I18nManager.t("common.today")}</span>
                    </div>
                    
                    <div class="medication-card__progress">
                        <div class="medication-card__progress-fill" style="width: ${progressPerc}%"></div>
                    </div>

                    <div class="medication-card__time">
                        ${sortedReminders.map((time, index) => {
                            let statusClass = '';
                            if (index < nextTimeIndex || nextTimeIndex === -1) {
                                statusClass = 'medication-card__time-text--past';
                            } 
                            else if (index === nextTimeIndex) {
                                statusClass = 'medication-card__time-text--next';
                            }
                            return `<span class="medication-card__time-text ${statusClass}">${time}</span>`;
                        }).join('')} 
                    </div>
                </div>
                <button class="medication-card__menu" data-action="menu" aria-label="Options">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="5" r="2" fill="currentColor"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        <circle cx="12" cy="19" r="2" fill="currentColor"/>
                    </svg>
                </button>
            </article>`;
        }).join('');
    listContainer.innerHTML = html;
    },
    renderChips(reminders) {
        const chipsContainer = document.getElementById('reminders-chips');
        if (!chipsContainer) return;

        chipsContainer.innerHTML = reminders.map(t => `
            <div class="time-chip">
                <span class="time-chip__text">${t}</span>
                <span class="time-chip__remove" data-action="delete-time">&times;</span>
            </div>
        `).join('');
    },
    openMedMenu(medId, medName) {
        const sheet = document.getElementById("med-menu-sheet");
        const title = sheet.querySelector(".menu-sheet__title");
        sheet.dataset.currentId = medId;
        title.textContent = medName;
        sheet.classList.add("menu-sheet--active");
        document.body.style.overflow = "hidden";
    },
    closeMedMenu(){
        const sheet = document.getElementById("med-menu-sheet");
        sheet.classList.remove("menu-sheet--active");
        document.body.style.overflow = "";
    },
    loadEditScreen(data){
        const mainTitle = document.getElementById("med-add-title");
        const itemName = document.getElementById("medication-input");
        const btn = document.getElementById("btn-med");
        btn.dataset.action = "edit-med-btn";
        itemName.value = data.item_name;
        mainTitle.textContent = 'Edit Medication';
        this.renderChips(data.reminders);
    },
    loadAddScreen(){
        const mainTitle = document.getElementById("med-add-title");
        const itemName = document.getElementById("medication-input");
        const btn = document.getElementById("btn-med");
        const reminders = document.getElementById("reminders-chips");
        reminders.innerHTML = "";
        btn.dataset.action = "save-med";
        itemName.value = '';
        mainTitle.textContent = 'Add Medication';

    },
    loadCalendar(data){
        const monthTitle = document.getElementById('calendar-month');
        const monthKey = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ][data.month-1];
        
        monthTitle.textContent = `${I18nManager.t(`calendar.months.${monthKey}`)} ${data.year}`;

        const listContainer = document.getElementById("calendar-days");

        listContainer.innerHTML = data.days.map((day, index) => {
            const status = day.average 
                ? PRESSURE.getPressureStatus(day.average.sys, day.average.dia)
                : null;
            return `
                <button class="calendar__day ${!day.is_current_month ? `calendar__day-not-current-month` : ``}" data-action="select-day" data-index="${index}">
                    <span class="calendar__day-number">${new Date(day.date).getDate()}</span>
                    ${status ? `<span class="calendar__day-indicator calendar__day-indicator--${status.name.toLowerCase()}"></span>` : ''}
                </button>
            `;
        }).join("");
        document.getElementById("calendar-info").innerHTML = `<p class="calendar-info__empty">No day selected</p>`;
        
    },
    updateDayInfo(dayData){
        const container = document.getElementById('calendar-info');
        
        if (!dayData || !dayData.measurements || dayData.measurements.length === 0) {
            container.innerHTML = `<p class="calendar-info__empty">${I18nManager.t('calendar.select_day')}</p>`;
            return;
        }
        
        const status = PRESSURE.getPressureStatus(dayData.average.sys, dayData.average.dia);
        const statusClass = status.name.toLowerCase();
        const statusLabel = I18nManager.t(`status.${statusClass}`);
        
        const html = `
            <div class="day-details">
                <div class="day-details__header">
                    <span class="day-details__date">${TimeConvert.formatDate(dayData.date)}</span>
                    <span class="day-details__badge day-details__badge--${statusClass}">${statusLabel}</span>
                </div>
                <div class="day-details__main">
                    <div class="day-details__avg">
                        <span class="day-details__label">${I18nManager.t('status.average')}</span>
                        <span class="day-details__value">${dayData.average.sys}/${dayData.average.dia}</span>
                    </div>
                    <div class="day-details__count">
                        <span class="day-details__label">${I18nManager.t('status.count')}</span>
                        <span class="day-details__value">${dayData.measurements.length}</span>
                    </div>
                </div>
                <ul class="day-details__list">
                    ${dayData.measurements.map(m => `
                        <li class="day-details__item">
                            <span class="day-details__item-time">${TimeConvert.formatTime(m.created_at)}</span>
                            <span class="day-details__item-val">${m.sys}/${m.dia}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        container.innerHTML = html;

    },
    loadSettingsScreen(){
        const targetPressureEl = document.getElementById("target-pressure-settings");
        const target = AppState.user.settings.target_pressure;
        if (target && target.sys && target.dia) {
            targetPressureEl.textContent = `${target.sys}/${target.dia}`;
        } else {
            targetPressureEl.textContent = "120/80";
        }
        const notificationToggle = document.getElementById("toggle-reminders");
        const isNotifEnabled = AppState.user.settings.notifications === true;
        notificationToggle.checked = isNotifEnabled;

        const reminderTimeEl = document.getElementById("reminder-time");
        const reminders = AppState.user.settings.pressure_reminders;
        reminderTimeEl.textContent = (reminders && reminders.length > 0) ? reminders[0] : "Not set";
        
        const reminderTimeBtn = reminderTimeEl.closest('.settings-list__item');
        if (isNotifEnabled){
            reminderTimeBtn.style.display = 'flex';
            reminderTimeBtn.style.opacity = '1';
        } else {
            reminderTimeBtn.style.display = 'none';
        }
        const currentLang = AppState.user.settings.language_code || 'en';
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });

    },
    renderCalendarPreview(data) {
        const stripContainer = document.getElementById("dashboard-calendar-strip");
        const weekAvgContainer = document.getElementById("calendar-week-avg");
        
        if (!stripContainer) return;
        const avgValue = weekAvgContainer.querySelector('.calendar-preview__avg-value');
        if (weekAvgContainer && data.week_average) {
            const avgSys = Math.round(data.week_average.sys);
            const avgDia = Math.round(data.week_average.dia);
            
            avgValue.textContent = `${avgSys}/${avgDia}`;
            avgValue.className = 'calendar-preview__avg-value';
            const avgStatus = PRESSURE.getPressureStatus(avgSys, avgDia);
            if (avgStatus) {
                avgValue.classList.add(`calendar-preview__avg-value--${avgStatus.name.toLowerCase()}`);
            }
        } else {
            avgValue.textContent = "";
        }

        stripContainer.innerHTML = '';

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const selectedDateStr = MeasurementsManager.currentDate 
            ? MeasurementsManager.currentDate.toISOString().split('T')[0]
            : todayStr;

        const html = data.days.map((day, index) => {
            const dateObj = new Date(day.date);
            const dayDateStr = day.date.split('T')[0];
            
            const isSelected = dayDateStr === selectedDateStr;
            const isToday = dayDateStr === todayStr;
            
            const status = day.average 
                ? PRESSURE.getPressureStatus(day.average.sys, day.average.dia) 
                : null;

            const weekDay = dateObj.toLocaleDateString(AppState.user.settings.language_code || 'en', { 
                weekday: 'short' 
            });

            const selectedClass = isSelected ? 'calendar-day--selected' : '';
            const todayClass = isToday ? 'calendar-day--today' : '';
            const statusClass = status ? `calendar-day__status-fill--${status.name.toLowerCase()}` : '';

            return `
                <button 
                    class="calendar-day ${selectedClass} ${todayClass}" 
                    data-action="select-preview-day" 
                    data-date="${day.date}"
                >

                    
                    <span class="calendar-day__name">${weekDay}</span>
                    <span class="calendar-day__number">${dateObj.getDate()}</span>
                    
                    <div class="calendar-day__status">
                        ${status ? `<div class="calendar-day__status-fill ${statusClass}"></div>` : ''}
                    </div>
                </button>
            `;
        }).join('');

        stripContainer.innerHTML = html;
        
        requestAnimationFrame(() => {
            const selectedDay = stripContainer.querySelector('.calendar-day--selected');
            if (selectedDay) {
                selectedDay.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest', 
                    inline: 'center' 
                });
            }
        });
    }
}

export const ActionHandler = {
    pageInitializers: {
        "main-screen": async () => { await MeasurementsManager.fetchAndRefresh();  await CalendarManager.initPreview(); },
        "stats-screen": () => StatisticsManager.loadStats(),
        "medications-screen": () => MedicationManager.fetchAndRefresh(),
        "history-screen": () => HistoryManager.loadHistory(),
        "calendar-screen": () => CalendarManager.init(),
        "settings-screen": () => UIManager.loadSettingsScreen()
    },
    btnAction: {
        "manual-add": () => { UIManager.switchView("add-screen") },
        "prev-day": (event) => { 
            AppState.quickButtons = true; 
            MeasurementsManager.prevDay(); 
            
            CalendarManager.currentDate = MeasurementsManager.currentDate;
            CalendarManager.initPreview(); 
        },
        "next-day": (event) => { 
            AppState.quickButtons = true; 
            MeasurementsManager.nextDay(); 
            CalendarManager.currentDate = MeasurementsManager.currentDate;
            CalendarManager.initPreview(); 
        },
        "history": () => { 
            HistoryManager.loadHistory();
            UIManager.switchView("history-screen"); 
        },
        "medications": async () => { 
            UIManager.switchView("medications-screen");
            await MedicationManager.fetchAndRefresh();
        },
        "save": async () => { 
            const success = await MeasurementsManager.inputAdd(); 
            
            if (success) UIManager.switchView("main-screen"); 
        },
        "cancel": () => { UIManager.switchView("main-screen"); },
        "back": () => { UIManager.switchView("main-screen");},
        "target-pressure": () => { UIManager.showTargetModal();},
        "close-modal": () => { UIManager.closeTargetModal();},
        "save-target": async () => { await SettingsManager.targetPressure();},
        "add-med": () => {
            UIManager.loadAddScreen(); 
            UIManager.switchView('medication-add-screen');
        },
        "save-med": async (event) => { 
            event.preventDefault(); 
            await MedicationManager.getData(false);
        },
        "cancel-med": () => { UIManager.switchView("medications-screen")},
        "back-med": () => { UIManager.switchView("medications-screen")},
        "add-time": () => {
            const time = document.getElementById('time-picker').value;
            MedicationManager.addReminder(time);
        },
        "delete-time": (event) => {
            const time = event.target.closest('.time-chip').querySelector('.time-chip__text').textContent;
            MedicationManager.deleteReminder(time);
        },
        "menu": (event) => {
            const card = event.target.closest(".medication-card");
            const id = card.dataset.id;
            const name = card.querySelector(".medication-card__text").textContent;
            UIManager.openMedMenu(id, name);
        },
        "close-menu": () => { UIManager.closeMedMenu();},
        "delete-med": async (event) => {
            const sheet = document.getElementById("med-menu-sheet");
            const medId = sheet.dataset.currentId;
            if (confirm("Delete this medication?")) {
                await MedicationManager.deleteMedication(medId);
                await MedicationManager.fetchAndRefresh();
                UIManager.closeMedMenu();
            }
        },
        "edit-med": async (event) => {
            const sheet = document.getElementById("med-menu-sheet");
            const medId = sheet.dataset.currentId;
            UIManager.switchView('medication-add-screen');
            await MedicationManager.getItemData(medId);
            UIManager.closeMedMenu();
        },
        "edit-med-btn": async (event) => {
            event.preventDefault(); 
            const sheet = document.getElementById("med-menu-sheet");
            const medId = sheet.dataset.currentId;
            await MedicationManager.getData(medId);
        },
        "prev-month": (event) => { CalendarManager.prevMonth(); },
        "next-month": (event) => { CalendarManager.nextMonth(); },
        "select-day": (event) => {
            const btn = event.target.closest('.calendar__day');
            const index = btn.dataset.index;
            const dateData = CalendarManager.monthlyData[index];
            document.querySelectorAll('.calendar__day').forEach(d => d.classList.remove('calendar__day--selected'));
            btn.classList.add('calendar__day--selected');
            UIManager.updateDayInfo(dateData);
        },
        "reminder-time": (event) => { UIManager.showRemindersModal(); },
        "close-reminder-modal": (event) => { UIManager.closeRemindersModal(); },
        "add-reminder-time": () => {
            const timeInput = document.getElementById('pressure-time-picker');
            if (timeInput.value) {
                SettingsManager.addPressureReminder(timeInput.value);
                timeInput.value = "";
            }
        },
        "delete-reminder": (event) => {
            const chip = event.target.closest('.time-chip');
            const time = chip.querySelector('.time-chip__text').textContent;
            SettingsManager.deletePressureReminder(time);
        },
        "clear-data": (event) => { SettingsManager.clearData(); },
        "export": (event) => { tg.showAlert("Export feature coming soon!"); },
        "toggle-notifications": (event) => { SettingsManager.updateNotification(event.target.checked); },
        "set-lang": (event) => {
            const lang = event.target.closest('[data-lang]').dataset.lang;
            SettingsManager.changeLanguage(lang);
        },
        "select-preview-day": (event) => {
            const dateStr = event.target.closest('.calendar-day').dataset.date;
            CalendarManager.currentDate = new Date(dateStr);
            CalendarManager.initPreview();
            MeasurementsManager.currentDate = new Date(dateStr);
            MeasurementsManager.fetchAndRefresh();
        }
    },
    init() {
        document.addEventListener("click", (event) => {
            const targetAction = event.target.closest("[data-action]");
            const targetPage = event.target.closest("[data-page]");
            const targetPeriod = event.target.closest("[data-period]")
            if (targetAction) {
                const actionName = targetAction.dataset.action;
                const actionFunc = this.btnAction[actionName];
                if (actionFunc) actionFunc(event);
            }
            if (targetPage) {
                const pageName = targetPage.dataset.page;
                UIManager.switchView(pageName);
                
                if (this.pageInitializers[pageName]) {
                    this.pageInitializers[pageName]();
                }
            }
            if (targetPeriod) {
                UIManager.updatePeriodButtons(targetPeriod.dataset.period); 
            }
        });
        const pressureInput = document.getElementById('pressure-input');
        pressureInput.addEventListener("input", (event) => {
            let value = event.target.value.replace(/\D/g, '');
            if (value.length > 3){
                value = value.slice(0, 3) + '/' + value.slice(3, 6);
            }
            event.target.value = value;
        });
        pressureInput.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && pressureInput.value.endsWith('/')) {
                pressureInput.value = pressureInput.value.slice(0, -1);
            }
        });

    }
}