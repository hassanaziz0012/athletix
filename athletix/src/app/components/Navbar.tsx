"use client";
import React, { useEffect, useState } from "react";
import Container, { ContainerSizes } from "./Container";
import Link from "next/link";
import icons from "../icons";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import useLoggedIn from "../hooks/useLoggedIn";

export default function Navbar() {
    const [navOpen, setNavOpen] = useState(false);
    const [isSelfHosted, setIsSelfHosted] = useState(false);
    const loggedIn = useLoggedIn();
    const path = usePathname();

    const toggleNav = () => {
        setNavOpen(!navOpen);
    };

    useEffect(() => {
        if (window.location.hostname.includes("vercel")) {
            setIsSelfHosted(false);
        } else {
            setIsSelfHosted(true);
        }
    }, []);

    return (
        !path.startsWith("/app") && (
            <nav className="bg-slate-700 text-slate-300 p-5">
                <Container size={ContainerSizes.extralarge}>
                    <div className="flex flex-row items-center justify-between">
                        <div className="text-xl tracking-widest uppercase">
                            <Link href={"/"}>Athletix</Link>
                        </div>
                        <div className="block sm:hidden">
                            <button onClick={toggleNav}>{icons.menu}</button>
                        </div>
                        <div className="hidden sm:flex flex-row gap-x-10">
                            {isSelfHosted === true && (
                                <>
                                    {loggedIn === true ? (
                                        <Link
                                            href={"/app/dashboard"}
                                            className="hover:text-white duration-300"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={"/auth/login"}
                                                className="hover:text-white duration-300"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href={"/auth/signup"}
                                                className="hover:text-white duration-300"
                                            >
                                                Signup
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {navOpen === true && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    marginTop: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                    marginTop: "3rem",
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                    marginTop: 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="sm:hidden flex flex-col items-stretch"
                            >
                                {isSelfHosted === true && (
                                    <>
                                        {loggedIn === true ? (
                                            <Link
                                                href={"/app/dashboard"}
                                                className="p-3 text-center hover:bg-slate-600 duration-300"
                                            >
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={"/auth/login"}
                                                    className="p-3 text-center hover:bg-slate-600 duration-300"
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    href={"/auth/signup"}
                                                    className="p-3 text-center hover:bg-slate-600 duration-300"
                                                >
                                                    Signup
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Container>
            </nav>
        )
    );
}
