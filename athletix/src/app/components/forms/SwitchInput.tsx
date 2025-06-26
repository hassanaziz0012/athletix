import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "motion/react";


interface SwitchInputProps {
    state: [string, React.Dispatch<React.SetStateAction<string>>];
    option1: {
        label: string;
        value: string;
    };
    option2: {
        label: string;
        value: string;
    };
}

export default function SwitchInput({ state, option1, option2 }: SwitchInputProps) {
    const [selected, setSelected] = state;
    const [dimensions, setDimensions] = useState({ width: 0, x: 0 });
    
    const ref1 = useRef<HTMLButtonElement>(null);
    const ref2 = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (selected === option1.value && ref1.current) {
            setDimensions({
                width: ref1.current.offsetWidth,
                x: ref1.current.offsetLeft,
            });
        } else if (selected === option2.value && ref2.current) {
            setDimensions({
                width: ref2.current.offsetWidth,
                x: ref2.current.offsetLeft,
            });
        }
    }, [selected]);

    return (
        <div className="relative inline-flex mt-2 mb-4 rounded-full bg-sky-600 border border-sky-600 py-1">
            <motion.div
                className="absolute top-0 bottom-0 bg-white rounded-full"
                animate={{ x: dimensions.x, width: dimensions.width }}
                transition={{ type: "spring", bounce: 0.2 }}
            ></motion.div>
            <button
                ref={ref1}
                className={`z-10 px-4 text-center py-2 rounded-full transition-colors duration-200 ${
                    selected === option1.value ? "text-sky-600" : "text-white"
                }`}
                onClick={() => setSelected(option1.value)}
                type="button"
            >
                {option1.label}
            </button>
            <button
                ref={ref2}
                className={`z-10 px-4 text-center py-2 rounded-full transition-colors duration-200 ${
                    selected === option2.value ? "text-sky-600" : "text-white"
                }`}
                onClick={() => setSelected(option2.value)}
                type="button"
            >
                {option2.label}
            </button>
        </div>
    );
}
