import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useAppInit } from './hooks/useAppInit';
import { MainScreen } from './features/main-screen/mainScreen';
import { Layout } from './components/ui/Layout';
import { StatsScreen } from './features/stats-screen/StatsScreen';
import { SettingsScreen } from './features/settings-screen/SettingsScreen';
import { MedicationScreen } from './features/medication-screen/MedicationScreen';
import { CalendarScreen } from './features/calendar-screen/CalendarScreen';

export const App: React.FC = () => {
    // const { isLoading, error } = useAppInit();

    // if (isLoading) {
    //     return (
    //         <div className="h-screen flex items-center justify-center">
    //             <span>Загрузка...</span>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="h-screen flex items-center justify-center">
    //             <span>Ошибка инициализации: {error.message}</span>
    //         </div>
    //     );
    // }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="stats" element={<StatsScreen />} />
                    <Route path="medication" element={<MedicationScreen />} />
                    <Route index element={<MainScreen />} />
                    <Route path="calendar" element={<CalendarScreen />} />
                    <Route path="settings" element={<SettingsScreen />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
