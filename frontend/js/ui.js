import { MeasurementsManager } from "./managers/measurements.js";
import { PRESSURE } from "./helpers/pressureLevels.js";
import { HistoryManager } from "./managers/history.js";
import { TimeConvert } from "./helpers/formatTime.js";
import { StatisticsManager } from "./managers/stats.js";
import { CONFIG } from "./config.js";
import { SettingsManager } from "./managers/settings.js";
import { MedicationManager } from "./managers/medications.js";


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
    loadSettings(settings) {
        const targetPressure = settings.target_pressure;
        document.getElementById('target-pressure-value').textContent = `${targetPressure.sys}/${targetPressure.dia}`;
        this.closeTargetModal();
        MeasurementsManager.fetchAndRefresh();
    },
    updateDashboard (data, count) {
        const pressureEl = document.getElementById("current-pressure");
        const countHintEl = document.getElementById("measurement-count");
        if (!data) {
            pressureEl.textContent = "--/--";
            countHintEl.style.display = "none";
            return;
        }

        const {sys, dia} = data;
        const status = PRESSURE.getPressureStatus(sys, dia);

        const statusLabel = document.getElementById("status-text");
        const statusCircle = document.querySelector(".status__circle");
        const statusDetail = document.querySelector(".status__detail-value");

        pressureEl.textContent = `${sys}/${dia}`;
        statusLabel.textContent = status.name;
        statusLabel.classList.remove('status__label--none', 'status__label--normal', 'status__label--high', 'status__label--low', 'status__label--elevated');
        statusCircle.classList.remove('status__circle--none', 'status__circle--normal', 'status__circle--high', 'status__circle--low', 'status__circle--elevated');
        statusDetail.classList.remove('status__detail-value--none','status__detail-value--normal', 'status__detail-value--high', 'status__detail-value--low', 'status__detail-value--elevated');

        statusLabel.classList.add(`status__label--${status.name.toLowerCase()}`);
        statusCircle.classList.add(`status__circle--${status.name.toLowerCase()}`);
        statusDetail.classList.add(`status__detail-value--${status.name.toLowerCase()}`);

        if (count > 0) {
            countHintEl.textContent = `Based on ${count} ${count === 1 ? 'measurement' : 'measurements'} today`;
            countHintEl.classList.add("active");
        } else {
            countHintEl.classList.remove("active");
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
                        
                        return `
                        <article class="history-item" data-id="${m.id}">
                            <div class="history-item__time">
                                <span class="history-item__hour">${TimeConvert.formatTime(m.created_at)}</span>
                            </div>
                            <div class="history-item__content">
                                <div class="history-item__pressure">
                                    <span class="history-item__value history-item__value--${statusClass}">
                                        ${m.sys}/${m.dia}
                                    </span>
                                </div>
                                ${m.note ? `<p class="history-item__note">${m.note}</p>` : ''}
                            </div>
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
        avgEl.className = `stat-card__value stat-card__value--${PRESSURE.getPressureStatus(stats.avg.sys, stats.avg.dia).name.toLowerCase()}`;
        const maxEl = document.getElementById('max-pressure');
        maxEl.textContent = `${stats.max.sys}/${stats.max.dia}`;
        maxEl.className = `stat-card__value stat-card__value--${PRESSURE.getPressureStatus(stats.max.sys, stats.max.dia).name.toLowerCase()}`;
        document.getElementById('max-date').textContent = TimeConvert.formatTime(stats.max.date); 
        
        const minEl = document.getElementById('min-pressure');
        minEl.textContent = `${stats.min.sys}/${stats.min.dia}`;
        minEl.className = `stat-card__value stat-card__value--${PRESSURE.getPressureStatus(stats.min.sys, stats.min.dia).name.toLowerCase()}`;
        document.getElementById('min-date').textContent = TimeConvert.formatTime(stats.min.date);

        document.getElementById('total-measurements').textContent = stats.total;
        const subtitles = { 'week': 'Last 7 days', 'month': 'Last 30 days', 'year': 'Last 12 months' };
        document.getElementById('period-subtitle').textContent = subtitles[period] || '';

        const distContainer = document.getElementById('distribution-bars');
        distContainer.innerHTML = stats.distribution.map(item => {
            
            return `
            <div class="distribution__bar">
                <span class="distribution__label" style="text-transform: capitalize;">${item.label}</span>
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
                labels: data.length === 12 ? data.map(d => TimeConvert.formatMonth(d.date)) : data.map(d => TimeConvert.formatGroupDate(d.date)),
                datasets: [{
                    label: 'Pressure Range',
                    data: dailyScores, 
                    borderColor: gradient,
                    borderWidth: 4,
                    pointRadius: 4,
                    pointBorderColor: 'rgba(26, 56, 41, 1)',
                    pointBorderWidth: 2,
                    spanGaps: true,
                    fill: true,
                    backgroundColor: 'rgba(52, 199, 89, 0.05)',
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
                layout: {
                    padding: {
                        top: 30,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        border: { display: false },
                        grid: {
                            color: CONFIG.colors.gridLines,
                            drawTicks: false
                        },
                        ticks: {
                            stepSize: 25,
                            padding: 15,
                            color: CONFIG.colors.lightGreen,
                            font: { size: 11, weight: '600', family: 'Inter' },
                            callback: (val) => {
                                let label = '';
                                if (val === 50) label = 'IDEAL';
                                if (val === 100) label = 'HIGH';
                                if (val === 0) label = 'LOW';
                                return label ? label + '    ' : '';
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
                            ticks: {
                                color: CONFIG.colors.lightGreen,
                                padding: 10,
                                font: { size: 10, weight: '500' }
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 56, 41, 0.9)',
                        titleColor: CONFIG.colors.lightGreen,
                        bodyColor: '#fff',
                        displayColors: false,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: (context) => {
                                const dayData = data[context.dataIndex];
                                if (!dayData?.measurements.length) return null;
                                const avg = PRESSURE.getAveragePressure(dayData.measurements);
                                return `Pressure: ${avg.sys}/${avg.dia}`;
                            }
                        }
                    }
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
                    <span class="status-banner__label">Next dose:</span>
                    <span class="status-banner__value"><strong class="status-banner__value-name">${this.globalNextDose.name}</strong> at ${this.globalNextDose.time}</span>
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
                    <span class="status-banner__label">Good job!</span>
                    <strong class="status-banner__value">Today there is no more medication to take</strong>
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
                        <span class="medication-card__status">${takenCount}/${totalCount} today</span>
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

    }
}

export const ActionHandler = {
    pageInitializers: {
        "main-screen": () => MeasurementsManager.fetchAndRefresh(),
        "stats-screen": () => StatisticsManager.loadStats(),
        "medications-screen": () => MedicationManager.fetchAndRefresh(),
        "history-screen": () => HistoryManager.loadHistory(),
    },
    btnAction: {
        "manual-add": () => { UIManager.switchView("add-screen") },
        "prev-day": () => { console.log("Change date prev") },
        "next-day": () => { console.log("Change date next") },
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
    }
}