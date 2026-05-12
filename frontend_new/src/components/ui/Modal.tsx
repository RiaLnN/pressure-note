import React from 'react';
import ReactDOM from 'react-dom';


interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    closeAriaLabel?: string;
}

export const Modal = ({
    children,
    isOpen,
    onClose,
    title,
    subtitle,
    closeAriaLabel = 'Close',
}: ModalProps) => {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center p-4"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="relative w-full max-w-md bg-bg-surface border border-border-subtle/60 rounded-3xl shadow-lg p-5"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {(title || subtitle) && (
                    <header className="flex items-start justify-between gap-4 mb-4">
                        <div className="min-w-0">
                            {title ? (
                                <h2 className="text-xl font-semibold leading-tight">{title}</h2>
                            ) : null}
                            {subtitle ? (
                                <div className="mt-1 text-xs text-text-soft">{subtitle}</div>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={closeAriaLabel}
                            className="shrink-0 size-10 rounded-full bg-bg-surface-muted/60 border border-border-subtle/60 flex items-center justify-center text-text-secondary hover:bg-bg-surface-muted/80 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </header>
                )}

                {children}
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};