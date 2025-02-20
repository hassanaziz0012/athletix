"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";
import ProfileIcon from "./ProfileIcon";
import icons from "@/app/icons";
import useLoggedIn from "@/app/hooks/useLoggedIn";

export default function Sidebar({
    sidebarState,
}: {
    sidebarState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [sidebarOpen, setSidebarOpen] = sidebarState;
    const isLoggedIn = useLoggedIn();

    const navLinks = [
        {
            href: "/app/dashboard",
            text: "Dashboard",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                >
                    <path d="M520-600v-240h320v240zM120-440v-400h320v400zm400 320v-400h320v400zm-400 0v-240h320v240zm80-400h160v-240H200zm400 320h160v-240H600zm0-480h160v-80H600zM200-200h160v-80H200zm160-80" />
                </svg>
            ),
        },
        {
            href: "/app/workouts",
            text: "Workouts",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                >
                    <path d="m480-80-20-400-140-40H40v-80h240l280-200 52 61-166 119h114l312-180 48 56-340 264-20 400zM240-640q-33 0-56.5-23.5T160-720t23.5-56.5T240-800t56.5 23.5T320-720t-23.5 56.5T240-640" />
                </svg>
            ),
        },
        {
            href: "/app/templates",
            text: "Templates",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                >
                    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240zm0-80h360v-480H360zM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80zm160-240v-480z" />
                </svg>
            ),
        },
        {
            href: "/app/measurements",
            text: "Measurements",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                >
                    <path d="M200-160v-340q0-142 99-241t241-99 241 99 99 241-99 241-241 99zm80-80h260q108 0 184-76t76-184-76-184-184-76-184 76-76 184zm260-120q58 0 99-41t41-99-41-99-99-41-99 41-41 99 41 99 99 41m0-80q-25 0-42.5-17.5T480-500t17.5-42.5T540-560t42.5 17.5T600-500t-17.5 42.5T540-440M80-160v-200h80v200zm460-340" />
                </svg>
            ),
        },
        {
            href: "/app/exercises",
            text: "Exercises",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                >
                    <path d="m826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615zM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57zm397-336 57-57-303-303-57 57zM463-160l57-58-302-302-58 57zm-6-234 110-109-64-64-109 110zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161z" />
                </svg>
            ),
        },
    ];

    useEffect(() => {
        setLoggedIn(isLoggedIn === true ? true : false);
    }, [isLoggedIn]);

    return (
        <section
            className={`h-full w-full bg-slate-800 text-slate-300 duration-300 transition-[width] ${
                sidebarOpen ? "sm:w-56" : "sm:w-20"
            }`}
        >
            <nav className="flex flex-wrap gap-4 sm:flex-col justify-between items-center sm:items-stretch h-full rounded-xl px-6 py-3">
                <div className="hidden sm:mb-12 sm:flex items-center justify-between">
                    <Link
                        href={"/"}
                        className={`text-xl ${sidebarOpen ? "" : "hidden"}`}
                    >
                        Athletix
                    </Link>
                    <button
                        className="hover:text-white duration-300 hidden sm:block"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? icons.panelClose : icons.panelOpen}
                    </button>
                </div>
                <ul className="hidden sm:flex flex-col gap-y-6">
                    {loggedIn === true ? (
                        <>
                            {navLinks.map((link, i) => (
                                <NavLink
                                    key={i}
                                    href={link.href}
                                    hasIcon={true}
                                >
                                    <span className="w-6 h-6">{link.icon}</span>
                                    <span
                                        className={`${
                                            sidebarOpen
                                                ? "opacity-100"
                                                : "opacity-0"
                                        } duration-300 delay-150`}
                                    >
                                        {sidebarOpen && link.text}
                                    </span>
                                </NavLink>
                            ))}
                        </>
                    ) : (
                        <>
                            <NavLink href="/auth/login">Login</NavLink>
                            <NavLink href="/auth/signup">Sign Up</NavLink>
                        </>
                    )}
                </ul>

                <ul className="flex flex-wrap gap-4 sm:hidden">
                    {loggedIn === true ? (
                        <>
                            {navLinks.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="p-3 bg-slate-600 rounded-xl"
                                >
                                    <span className="w-6 h-6">{link.icon}</span>
                                </Link>
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                </ul>
                <div className="sm:mb-36 sm:pt-4 sm:border-t border-t-slate-600">
                    <ProfileIcon showName={sidebarOpen} />
                </div>
            </nav>
        </section>
    );
}
