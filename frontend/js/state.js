export const AppState = {
    _token: localStorage.getItem('token') || null,
    quickButtons: true,
    user: {
        username: null,
        settings: {
            theme: 'light',
            target_pressure: {sys: 120, dia: 80},
            notifications: true,
            pressure_reminders: ["09:00", "21:00"],
            language_code: "en"
        }
    },
    get token() {
        return this._token;
    },
    set token(token) {
        this._token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },
    set settings(newSettings) {
        this.user.settings = {...(this.user.settings || {}), ...newSettings};
    },
    get targetPressure(){
        return { sys: this.user.settings.target_pressure.sys, dia: this.user.settings.target_pressure.dia }; 
    }
};