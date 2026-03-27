import { Button } from "../../components/ui/Button";
import { LastMeasurementCard } from "./components/LastMeasurementCard";
import type { Measurement } from "../../types/measurements";
import { Card } from "../../components/ui/Card";
const testData: Measurement = {
    id: 1,
    sys: 120,
    dia: 80,
    status: 'Normal',
    created_at: '12:00'
}
export const MainScreen = () => {
    const handleAddClick = () => {};

    return (
        <main className="min-h-screen bg-bg-app text-text-primary bg-background text-foreground">
            <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
                <LastMeasurementCard data={testData} />

                <Button
                    label="Add measurement"
                    icon = 'add'
                    onClick={handleAddClick}
                    variant="primary"
                />
                <Card className="mt-2">
                    <p className="text-sm text-text-muted mb-2">Last 7 days</p>
                    <p className="text-xs text-text-soft">
                        Здесь позже будет график
                    </p>
                </Card>
            </div>
        </main>
    );
};