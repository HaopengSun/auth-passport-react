import React, { FC, MouseEvent } from 'react';

interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: FC<ButtonProps> = ({ onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
