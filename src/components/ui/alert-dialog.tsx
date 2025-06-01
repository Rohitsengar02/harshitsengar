"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const AlertDialog = ({ 
  open: externalOpen, 
  onOpenChange, 
  children 
}: AlertDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };
  
  return (
    <AlertDialogContext.Provider
      value={{ isOpen, setOpen: handleOpenChange }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
};

interface AlertDialogContext {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContext>({
  isOpen: false,
  setOpen: () => {},
});

export const useAlertDialog = () => React.useContext(AlertDialogContext);

export interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  asChild?: boolean;
}

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ className, asChild, onClick, ...props }, ref) => {
    const { setOpen } = useAlertDialog();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      if (onClick) onClick(e);
    };
    
    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={className}
        {...props}
      />
    );
  }
);

AlertDialogTrigger.displayName = "AlertDialogTrigger";

export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, ...props }, ref) => {
    const { isOpen, setOpen } = useAlertDialog();
    
    if (!isOpen) return null;
    
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <AlertDialogOverlay />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`relative z-50 w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg ${className || ""}`}
            >
              <div {...props} ref={ref} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

AlertDialogContent.displayName = "AlertDialogContent";

export interface AlertDialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useAlertDialog();
    
    if (!isOpen) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-40 bg-black/50 ${className || ""}`}
      >
        <div {...props} ref={ref} />
      </motion.div>
    );
  }
);

AlertDialogOverlay.displayName = "AlertDialogOverlay";

export interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mb-4 text-center sm:text-left ${className || ""}`}
        {...props}
      />
    );
  }
);

AlertDialogHeader.displayName = "AlertDialogHeader";

export interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`}
        {...props}
      />
    );
  }
);

AlertDialogFooter.displayName = "AlertDialogFooter";

export interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className || ""}`}
        {...props}
      />
    );
  }
);

AlertDialogTitle.displayName = "AlertDialogTitle";

export interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-sm text-gray-500 dark:text-gray-400 ${className || ""}`}
        {...props}
      />
    );
  }
);

AlertDialogDescription.displayName = "AlertDialogDescription";

export interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useAlertDialog();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false);
      if (onClick) onClick(e);
    };
    
    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className || ""}`}
        {...props}
      />
    );
  }
);

AlertDialogAction.displayName = "AlertDialogAction";

export interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useAlertDialog();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false);
      if (onClick) onClick(e);
    };
    
    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none mt-3 sm:mt-0 ${className || ""}`}
        {...props}
      />
    );
  }
);

AlertDialogCancel.displayName = "AlertDialogCancel";
