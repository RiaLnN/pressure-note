import { measurementsApi } from "../api.js"
import { PRESSURE } from "../helpers/pressureLevels.js";
import { UIManager } from "../ui.js"

export const StatisticsManager = {
    async loadStats(period = 'week'){
        const data = await measurementsApi.getStats(period);
        const allMeasurements = data.flatMap(day => day.measurements);
        const processed = this.processStats(allMeasurements);
        UIManager.renderStats(processed, period);
        UIManager.renderChart(data);
    },
    processStats(data){
        if (!data.length) return null;

        const sysValues = data.map(m => m.sys);
        const diaValues = data.map(m => m.dia);

        return {
            avg: PRESSURE.getAveragePressure(data),
            max: {
                sys: Math.max(...sysValues),
                dia: Math.max(...diaValues),
                date: data.find(m => m.sys === Math.max(...sysValues)).created_at
            },
            min: {
                sys: Math.min(...sysValues),
                dia: Math.min(...diaValues),
                date: data.find(m => m.sys === Math.min(...sysValues)).created_at
            },
            total: data.length,
            distribution: this.calculateDistribution(data)
        }
    },
    calculateDistribution(data) {
        const counts = { normal: 0, elevated: 0, high: 0, low: 0};
        data.forEach(m => {
            const status = PRESSURE.getPressureStatus(m.sys, m.dia).name.toLowerCase();
            counts[status]++;
        });
        return Object.keys(counts).map(key => ({
            label: key,
            perc: Math.round((counts[key] / data.length) * 100)
        }));
    },
}