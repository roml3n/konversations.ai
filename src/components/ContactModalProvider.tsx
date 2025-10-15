"use client";

import React from "react";
import ContactModal from "./ContactModal";

type ContactModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ContactModalContext =
  React.createContext<ContactModalContextValue | null>(null);

export const useContactModal = (): ContactModalContextValue => {
  const ctx = React.useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
};

export default function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  // Close on route change safety (optional)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const value = React.useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close]
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {isOpen ? <ContactModal onRequestClose={close} /> : null}
    </ContactModalContext.Provider>
  );
}
