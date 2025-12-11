import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const hoverClass = hoverable ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer' : '';
  
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;