"use client";
import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useState,
} from "react";

const useDropdown = (
    closestTarget: string
): [boolean, MouseEventHandler<HTMLButtonElement>] => {
    const [active, setActive] = useState(false);

    const clickListener = useCallback((e: MouseEvent) => {
        const target = e.target as Element;
        if (!target.matches(closestTarget)) {
            setActive(false);
        }
    }, []);

    const toggleDropdown: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setActive(!active);
    };

    useEffect(() => {
        if (active === true) {
            document.addEventListener("click", clickListener);
        }

        return () => {
            document.removeEventListener("click", clickListener);
        };
    });

    return [active, toggleDropdown];
};

export default useDropdown;
