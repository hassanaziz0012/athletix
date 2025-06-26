"use client";
import React, { useState } from "react";
import Sidebar from "./components/nav/Sidebar";
import BreadcrumbContext, { BreadcrumbNavItem } from "./BreadcrumbContext";
import BreadcrumbNav from "./components/BreadcrumbNav";
import { ToastContainer } from "react-toastify";


export default function PageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [ breadcrumb, setBreadcrumb ] = useState<BreadcrumbNavItem[]>();

    return (
        <BreadcrumbContext.Provider value={{ value: breadcrumb, setValue: setBreadcrumb }}>
            <div className="flex">
                <div className="fixed z-10 sm:top-0 left-0 right-0 sm:right-auto sm:h-full bottom-0">
                    <Sidebar sidebarState={[sidebarOpen, setSidebarOpen]} />
                </div>
                <div
                    className={`basis-0 grow transition-all duration-300 mb-24 sm:mb-0 ${
                        sidebarOpen === true ? "sm:ml-56" : "sm:ml-20"
                    }`}
                >
                    <div className="m-2">
                        <BreadcrumbNav />
                    </div>
                    <div className="mt-16">{children}</div>
                </div>
            </div>
            <ToastContainer />
        </BreadcrumbContext.Provider>
    );
}
