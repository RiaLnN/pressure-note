import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { LastMeasurementCard } from './components/LastMeasurementCard';
import { MainHeader } from './components/MainHeader';
import { WeekChartCard } from './components/WeekChartCard';
import { RecentRecordsCard } from './components/RecentRecordsCard';
import { useMainScreenData } from './hooks/useMainScreenData';
import { MAIN_SCREEN_TEXT } from './constants';

export const MainScreen = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useMainScreenData();

    const handleAddClick = () => {
        // TODO: will be wired to AddMeasurement screen
    };

    return (
        <div className="flex flex-col gap-5">
            <MainHeader />

            {error ? (
                <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-text-secondary">
                    {error.message}
                </div>
            ) : null}

            <LastMeasurementCard data={data.lastMeasurement} />

            <Button
                label={MAIN_SCREEN_TEXT.cta.addMeasurement}
                icon="add"
                onClick={handleAddClick}
                variant="primary"
                isLoading={isLoading}
            />

            <WeekChartCard week={data.week} onDetails={() => navigate('/stats')} />

            <RecentRecordsCard items={data.recent} onAll={() => navigate('/stats')} />
        </div>
    );
};