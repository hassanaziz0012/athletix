import React from "react";
import Container, { ContainerSizes } from "./Container";
import Link from "next/link";

export default function WhyCreateThis() {
    const githubLink = "https://github.com/hassanaziz0012/athletix";
    const twitterLink = "https://x.com/nothassanaziz";

    return (
        <section className="bg-white py-20">
            <Container size={ContainerSizes.extralarge}>
                <div className="text-slate-600">
                    <h2 className="text-2xl mb-8 text-black">
                        Why did I create this app?
                    </h2>

                    <p className="mb-4">
                        Honestly, it comes down to a bunch of reasons. The
                        biggest reason being that I wanted to become better at
                        React, NextJS, and the frontend ecosystem. I was pretty
                        comfortable with the whole stack, but I wanted to build
                        something advanced and see how well I could do.
                    </p>

                    <p className="mb-4">
                        Working on this project taught me so many new things
                        about React and NextJS. Just off the top of my head:
                    </p>

                    <ol className="list-decimal list-inside flex flex-col gap-y-2 mb-4">
                        <li>
                            Learned how Custom hooks work in React. They&apos;re
                            soooo useful!
                        </li>
                        <li>
                            Learned a ton of new stuff about Docker, cos one of
                            my goals was to dockerize the whole app (frontend,
                            backend, and db)!
                        </li>
                        <li>
                            Become pretty comfortable using React Motion and
                            used it to create some pretty cool UX experiences.
                        </li>
                        <li>
                            Learned a ton of new stuff about NextJS and how I
                            can use it to better structure my apps.
                        </li>
                    </ol>

                    <p className="mb-4">
                        And a hundred other things that I&apos;m missing here.
                    </p>

                    <p className="mb-4">
                        The other reason was cos I&apos;m a huge gym rat, and I
                        wanted a cool dashboard app to manage my training. So I
                        basically just filled Athletix with all the features I
                        would want in a fitness app. I&apos;m pretty happy with
                        how it came out.
                    </p>

                    <p className="mb-4">
                        If you wanna see the code, or see my other projects,
                        check out the{" "}
                        <Link
                            className="text-sky-500 border-b border-b-transparent hover:border-sky-500 duration-300"
                            target="_blank"
                            href={githubLink}
                        >
                            Github repository
                        </Link>
                        .
                    </p>

                    <p className="mb-4">
                        If you wanna get in touch with me, shoot a DM on{" "}
                        <Link
                            className="text-sky-500 border-b border-b-transparent hover:border-sky-500 duration-300"
                            target="_blank"
                            href={twitterLink}
                        >
                            Twitter/X
                        </Link>
                        .
                    </p>
                </div>
            </Container>
        </section>
    );
}
