import React from "react";
import { cn } from "../../../lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("w-[95%] mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;
