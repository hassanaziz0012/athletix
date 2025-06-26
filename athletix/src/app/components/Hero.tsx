"use client";
import React from "react";
import Container, { ContainerSizes } from "./Container";
import Link from "next/link";
import PrimaryButton from "./buttons/PrimaryButton";
import BorderedImage from "./BorderedImage";

export default function Hero() {
    return (
        <section className="bg-[url('/images/hero-bg.jpg')] bg-cover bg-center relative isolate">
            <Container
                size={ContainerSizes.extralarge}
                className="h-full flex flex-col justify-center"
            >
                <div className="flex gap-x-6 gap-y-12 flex-col md:flex-row py-20">
                    <div className="max-w-screen-sm">
                        <h1 className="[font-size:clamp(2.5rem,5vw,3.5rem)] font-semibold leading-normal mb-8">
                            Your{" "}
                            <span className="text-sky-500">all-in-one</span>{" "}
                            workout companion
                        </h1>
                        <p className="text-slate-600 mb-4">
                            Track your workouts, exercises, and progress in one
                            place. Get personalized coaching and guidance to
                            help you reach your fitness goals.
                        </p>

                        <Link href={"https://github.com/hassanaziz0012/athletix?tab=readme-ov-file#installation"} target="_blank">
                            <PrimaryButton onClick={() => {}}>
                                Get Started
                            </PrimaryButton>
                        </Link>
                    </div>
                    
                    <BorderedImage imgSrc="/images/athletix-dashboard-preview.png" altText="app dashboard" />
                </div>
            </Container>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 -z-10"></div>
        </section>
    );
}
