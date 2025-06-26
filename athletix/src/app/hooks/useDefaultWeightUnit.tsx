import { useEffect, useState } from "react";

const useDefaultWeightUnit = () => {
    const [unit, setUnit] = useState<"kg" | "lb">("kg");

    useEffect(() => {
        const value = localStorage.getItem("defaultUnit") as "kg" | "lb";
        if (value) {
            setUnit(value);
        }
    }, []);

    return unit;
};

export default useDefaultWeightUnit;