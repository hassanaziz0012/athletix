"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef } from "react";

interface ModalProps {
    modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    children: React.ReactNode;
}

export default function Modal({ modalState, children }: ModalProps) {
    const [isOpen, setIsOpen] = modalState;

    const modal = useRef(null);

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        });

        window.addEventListener("click", (e) => {
            if (e.target === modal.current) {
                setIsOpen(false);
            }
        });

        return () => {
            // TODO: event listeners are not being removed properly.

            window.removeEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    setIsOpen(false);
                }
            });

            window.removeEventListener("click", (e) => {
                if (e.target === modal.current) {
                    setIsOpen(false);
                }
            });
        };
    }, [isOpen]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div
                        ref={modal}
                        className="fixed z-10 top-0 left-0 w-full h-full bg-slate-400 bg-opacity-30 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="overflow-y-auto max-h-[83%]"
                        >
                            {children}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
