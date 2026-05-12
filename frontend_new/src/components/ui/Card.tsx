import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick
}) => {
    const baseStyles = "bg-bg-surface rounded-3xl shadow-sm border border-border-subtle/60 p-5 transition-all";
    const combinedStyles = `${baseStyles} ${className} ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''}`;
    return (
        <section 
        className={combinedStyles}
        onClick={onClick}
        >
            {children}
        </section>
    )
}