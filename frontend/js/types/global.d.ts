
interface Window {
    Telegram: {
        WebApp: TelegramWebApp;
    };
}
interface TelegramWebApp {
    initData: string;
    initDataUnsafe: object;
    showAlert(message: string): void; // Исправил опечатку showAllert -> showAlert
    showConfirm(message: string, callback?: (result: boolean) => void): void;
    expand(): void;
    close(): void;
    HapticFeedback: {
        notificationOccurred(type: 'error' | 'success' | 'warning'): void;
        impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    };
}