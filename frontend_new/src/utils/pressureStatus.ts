import type {PressureStatus} from "../types/measurements";


interface StatusClasses {
    bg: string;
    text: string;
    border: string;
}

export const PRESSURE_STATUS_STYLES: Record<PressureStatus, StatusClasses> = {
    Normal: {
        bg: 'bg-bg-status-normal/80',
        text: 'text-text-status-normal',
        border: 'border border-border-status-normal/40',
    },
    Elevated: {
        bg: 'bg-bg-status-elevated/80',
        text: 'text-text-status-elevated',
        border: 'border border-border-status-elevated/40',
    },
    High: {
        bg: 'bg-bg-status-high/80',
        text: 'text-text-status-high',
        border: 'border border-border-status-high/40',
    },
    Low: {
        bg: 'bg-bg-status-low/80',
        text: 'text-text-status-low',
        border: 'border border-border-status-low/40',
    },
};