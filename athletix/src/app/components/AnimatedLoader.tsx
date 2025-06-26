import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { animatedIcons } from "../icons";

export default function AnimatedLoader({
    children,
    show = false,
}: {
    children: React.ReactNode;
    show: boolean;
}) {
    return (
        <AnimatePresence mode="wait">
            {show ? (
                <motion.div
                    initial={{
                        opacity: 0.5,
                        scale: 0.75,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: 0.5,
                        },
                    }}
                >
                    {children}
                </motion.div>
            ) : (
                <motion.div
                    key={"loading"}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                >
                    {/* <img
                        src="./images/treadmill-loader.gif"
                        alt="person running on treadmill"
                        className="w-64"
                    /> */}
                    <div className="w-1/2 h-1/2">
                        {animatedIcons.motionBlurLoader}
                    </div>
                    <p className="text-xl sr-only">Loading...</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
