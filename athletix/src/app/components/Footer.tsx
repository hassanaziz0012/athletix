import React from "react";
import Container, { ContainerSizes } from "./Container";
import Link from "next/link";

export default function Footer() {
    const twitterLink = "https://x.com/nothassanaziz";
    const githubLink = "https://github.com/hassanaziz0012";
    const agencyLink = "https://www.hassandev.me";

    return (
        <footer className="py-5 bg-slate-700 text-slate-300">
            <Container size={ContainerSizes.extralarge}>
                <div className="flex items-center justify-between flex-wrap gap-x-12 gap-y-6">
                    <p className="text-center">&copy; Athletix</p>

                    <p>
                        Made by:{" "}
                        <Link
                            className="text-sky-400 border-b border-b-transparent hover:border-b-sky-400 duration-300"
                            target="_blank"
                            href={twitterLink}
                        >
                            Hassan Aziz
                        </Link>
                    </p>

                    <p>
                        See my other projects on{" "}
                        <Link
                            className="text-sky-400 border-b border-b-transparent hover:border-b-sky-400 duration-300"
                            target="_blank"
                            href={githubLink}
                        >
                            Github
                        </Link>
                    </p>

                    <p>
                        Check out my{" "}
                        <Link
                            className="text-sky-400 border-b border-b-transparent hover:border-b-sky-400 duration-300"
                            target="_blank"
                            href={agencyLink}
                        >
                            dev agency
                        </Link>
                    </p>
                </div>
            </Container>
        </footer>
    );
}
