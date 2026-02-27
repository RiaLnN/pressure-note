export const AppState = {
    _token: localStorage.getItem('token') || null,
    user: {
        username: null,
        settings: {
            theme: 'light',
            target_pressure: {sys: 120, dia: 80},
            notification: true
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