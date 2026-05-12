import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const baseButtonClass =
        'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl font-medium text-xs transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/80 focus:ring-offset-bg-surface';

    const getButtonClasses = (path: string) => {
        const active = isActive(path);
        return [
            baseButtonClass,
            active
                ? 'bg-accent/10 text-text-primary'
                : 'text-text-muted hover:bg-bg-surface-muted/60',
        ].join(' ');
    };
    // const getAddButtonClasses = () => {
    //     const active = isActive('/');
    //     return [
    //         'flex items-center justify-center rounded-full w-14 h-14 shadow-xl border border-border-strong transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/80 focus:ring-offset-bg-surface',
    //         active
    //             ? 'bg-accent text-text-on-cta'
    //             : 'bg-accent/80 text-text-on-cta/90',
    //     ].join(' ');
    // };
    return (
        <div className="min-h-screen bg-bg-app text-text-primary">
            <div className="min-h-screen max-w-md mx-auto flex flex-col">
                <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24">
                    <Outlet />
                </main>

                <nav className="fixed inset-x-0 bottom-0 flex justify-center pb-4">
                    <div className="w-full max-w-md px-4">
                        <div className="bg-bg-surface/95 border border-border-subtle/60 rounded-3xl shadow-lg backdrop-blur flex items-center justify-between px-4 py-2">
                            <button
                                type="button"
                                className={getButtonClasses('/')}
                                onClick={() => navigate('/')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                                </svg>

                            </button>
                            <button
                                type="button"
                                className={getButtonClasses('/stats')}
                                onClick={() => navigate('/stats')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                                </svg>

                            </button>
                            
                            <button
                                type="button"
                                className={getButtonClasses('/medication')}
                                onClick={() => navigate('/medication')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M12.876 19.957l1.177-1.178a.75.75 0 00-1.06-1.06l-1.179 1.178a5.25 5.25 0 01-7.425-7.424l1.178-1.179a.75.75 0 10-1.06-1.06l-1.179 1.178a6.75 6.75 0 109.55 9.549z" />
                                    <path d="M9.424 4.043L8.247 5.22a.75.75 0 001.06 1.06l1.179-1.178a5.25 5.25 0 017.425 7.424l-1.178 1.179a.75.75 0 101.06 1.06l1.179-1.178a6.75 6.75 0 10-9.55-9.549z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className={getButtonClasses('/calendar')}
                                onClick={() => navigate('/calendar')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                                </svg>

                            </button>
                            <button
                                type="button"
                                className={getButtonClasses('/settings')}
                                onClick={() => navigate('/settings')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};