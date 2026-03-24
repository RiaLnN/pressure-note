import React from 'react';
import { useAppInit } from './hooks/useAppInit';
import { MainScreen } from './features/main-screen/mainScreen';

export const App: React.FC = () => {
    const { isLoading, error } = useAppInit();

    if (isLoading) {
    return (
        <div className="h-screen flex items-center justify-center">
            <span>Загрузка...</span>
        </div>
    );
    }

    if (error) {
    return (
        <div className="h-screen flex items-center justify-center">
            <span>Ошибка инициализации: {error.message}</span>
        </div>
    );
    }

    return (
    <div className="min-h-screen bg-background text-foreground">
        <MainScreen />
    </div>
    );
};
