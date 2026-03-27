import React from 'react';

export const StatsScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-app text-text-primary">
            <div className="max-w-md mx-auto px-4 pt-6 pb-6">
                <h1 className="text-xl font-semibold mb-2">Статистика</h1>
                <p className="text-sm text-text-soft">
                    Здесь позже появится экран со статистикой измерений и графиками.
                </p>
            </div>
        </div>
    );
};