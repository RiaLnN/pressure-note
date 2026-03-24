import React, {useEffect, useState} from "react";
import { useUserStore } from "./store/useUserStore";

export const App: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    
    const updateSettings = useUserStore((s) => s.updateSettings);
    const updateUsername = useUserStore((s) => s.updateUsername);
    const setToken = useUserStore((s) => s.setToken);

    useEffect(() => {
        async function init() {
            try {
                const tg = Telegram.WebApp;
                if (tg) {
                    tg.ready();
                    const initDataUnsafe = tg.initDataUnsafe;
                }
            } catch (error) {
                console.log(error);
            }
        }
    })
}