import icons from "@/app/icons";
import React from "react";

export default function Tooltip({ children }: { children: React.ReactNode }) {
    return (
        <button className="hover:cursor-help relative group">
            <span>{icons.tooltip}</span>

            <div className="absolute p-2 mt-2 bg-slate-700 shadow top-full right-0 rounded invisible opacity-0 group-hover:visible group-hover:opacity-100 duration-300">
                {children}
            </div>
        </button>
    );
}
