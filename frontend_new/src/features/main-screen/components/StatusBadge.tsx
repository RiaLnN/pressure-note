import type { PressureStatus } from "../../../types/measurements";
import { PRESSURE_STATUS_STYLES } from "../../../utils/pressureStatus";

interface Props {
    status: PressureStatus;
}

export const StatusBadge = ({ status }: Props) => {
    const style = PRESSURE_STATUS_STYLES[status];

    return (
        <span
            className={[
                'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold',
                style.bg,
                style.text,
                style.border,
            ]
            .join(' ')}
        >
            {status}
        </span>
    );
};