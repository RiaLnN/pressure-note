import { Measurement } from "../types/types.js";
import { AppState } from "../state.js";

enum LevelName {
    High = 'High',
    Elevated = 'Elevated',
    Normal = 'Normal',
    Low = 'Low'
}

interface Level {
    name: LevelName;
    minSys: number;
    minDia: number;
}


export const PRESSURE = {
    getDynamicLevels(targetSys: number, targetDia: number): Level[] {
        return [
            {
                name: LevelName.High,
                minSys: targetSys + 20,
                minDia: targetDia + 15,
            },
            {
                name: LevelName.Elevated,
                minSys: targetSys + 10,
                minDia: targetDia + 7
            },
            {
                name: LevelName.Normal,
                minSys: targetSys - 10,
                minDia: targetDia - 10
            },
            {
                name: LevelName.Low,
                minSys: 0,
                minDia: 0
            }
        ] 
    },
    getPressureStatus(sys: number, dia: number): Level {
        const {sys: targetSys, dia: targetDia}  = AppState.targetPressure;
        const levels = this.getDynamicLevels(targetSys, targetDia);

        const status = levels.find(l => sys >= l.minSys || dia >= l.minDia);
        return status || levels[levels.length - 1]
    },
    getAveragePressure(measurements: Measurement[]): Measurement {
        if (measurements.length === 0) return {sys: 0, dia: 0};
        let sumSys = 0;
        let sumDia = 0;

        measurements.forEach(pressure => {
            sumSys += pressure.sys
            sumDia += pressure.dia
        });
        return {sys: Math.round(sumSys / measurements.length), dia: Math.round(sumDia / measurements.length)}
    },
    calculateHealthScore(sys: number, dia: number): number {
        const {sys: idealSys,  dia: idealDia} = AppState.targetPressure;
        const sysDiff = (sys - idealSys); 
        const diaDiff = (dia - idealDia);
        let score = 50 + (sysDiff + diaDiff) / 2;
        return Math.max(0, Math.min(100, Math.round(score)));
    },
    getIndicatorClass(score: number | null): string {
        if (score === null) return '';
        if (score >= 80) return 'calendar__day-indicator--high';
        if (score >= 60) return 'calendar__day-indicator--elevated';
        if (score >= 40) return 'calendar__day-indicator--good';
        return 'calendar__day-indicator--low';
    },
};