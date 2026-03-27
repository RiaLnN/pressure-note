import type { Measurement } from "../../../types/measurements";
import { Card } from "../../../components/ui/Card";
import { StatusBadge } from "./StatusBadge";
import { useUserStore } from "../../../store/useUserStore";

interface Props {
    data: Measurement
}

export const LastMeasurementCard = ({ data }: Props) => {
    const target_pressure = useUserStore((state) => state.settings.target_pressure)
    const target_str = `${target_pressure.sys}/${target_pressure.dia}`;
    return (
        <Card className="text-text-primary p-6 md:p-7">
            <section className="flex justify-between items-start mb-4">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-text-soft">
                    Last measurement
                </p>
                <StatusBadge status={data.status} />
            </section>

            <section className="flex items-baseline gap-2">
                <div className="flex gap-2 items-baseline">
                    <h2 className="text-7xl font-bold leading-none">
                        {data.sys}
                    </h2>
                    <span className="text-5xl font-bold text-text-muted leading-none">
                        / {data.dia}
                    </span>
                </div>
                <span className="ml-2 text-sm text-text-muted">
                    мм рт. ст.
                </span>
            </section>

            <section className="mt-5 pt-4 border-t border-border-subtle/60 text-xs text-text-soft flex justify-between">
                <span>Target {target_str}</span>
                <span>{data.created_at}</span>
            </section>
        </Card>
    );
};