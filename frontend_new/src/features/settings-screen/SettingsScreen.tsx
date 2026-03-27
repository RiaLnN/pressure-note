import React from 'react';

export const SettingsScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-app text-text-primary">
            <div className="max-w-md mx-auto px-4 pt-6 pb-6">
                <h1 className="text-xl font-semibold mb-2">Настройки</h1>
                <p className="text-sm text-text-soft">
                    Здесь позже появятся настройки профиля, напоминаний и приложения.
                </p>
            </div>
        </div>
    );
};