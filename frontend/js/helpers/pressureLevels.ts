import { AppState } from "../state.js";

interface Level {
    name: string;
    class: string;
    minSys: number;
    minDia: number;
} 
type LevelsList = Array<Level>
export const PRESSURE = {
    getDynamicLevels(targetSys: number, targetDia: number): LevelsList {
        return [
            {
                name: 'High',
                class: 'status--high',
                minSys: targetSys + 20,
                minDia: targetDia + 15,
            },
            {
                name: 'Elevated',
                class: 'status--elevated',
                minSys: targetSys + 10,
                minDia: targetDia + 7
            },
            {
                name: 'Normal',
                class: 'status--normal',
                minSys: targetSys - 10,
                minDia: targetDia - 10
            },
            {
                name: 'Low',
                class: 'status--low',
                minSys: 0,
                minDia: 0
            }
        ]
    },
    getPressureStatus(sys, dia) {
        const {sys: targetSys, dia: targetDia}  = AppState.targetPressure;
        const levels = this.getDynamicLevels(targetSys, targetDia);
        if (sys >= levels[0].minSys || dia >= levels[0].minDia) return levels[0]; // High
        if (sys >= levels[1].minSys || dia >= levels[1].minDia) return levels[1]; // Elevated
        if (sys >= levels[2].minSys && dia >= levels[2].minDia) return levels[2]; // Normal

        return levels[3]; // Low
    },
    getAveragePressure(measurements){
        let sumSys = 0;
        let sumDia = 0;

        measurements.forEach(pressure => {
            sumSys += pressure.sys
            sumDia += pressure.dia
        });
        return {sys: Math.round(sumSys / measurements.length), dia: Math.round(sumDia / measurements.length)}
    },
    calculateHealthScore(sys, dia) {
        const {sys: idealSys,  dia: idealDia} = AppState.targetPressure;
        const sysDiff = (sys - idealSys); 
        const diaDiff = (dia - idealDia);
        let score = 50 + (sysDiff + diaDiff) / 2;
        return Math.max(0, Math.min(100, Math.round(score)));
    },
    getIndicatorClass(score) {
        if (score === null) return '';
        if (score >= 80) return 'calendar__day-indicator--high';
        if (score >= 60) return 'calendar__day-indicator--elevated';
        if (score >= 40) return 'calendar__day-indicator--good';
        return 'calendar__day-indicator--low';
    },
};