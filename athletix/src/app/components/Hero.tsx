"use client";
import React from "react";
import Container, { ContainerSizes } from "./Container";
import Link from "next/link";
import PrimaryButton from "./buttons/PrimaryButton";

export default function Hero() {
    return (
        <div className="bg-[url('/images/hero-bg.jpg')] bg-cover bg-center relative isolate">
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

                        <Link href={"/auth/signup"}>
                            <PrimaryButton onClick={() => {}}>
                                Get Started
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="relative isolate rounded-xl">
                        <div className="relative">
                            <img
                                src="/images/athletix-dashboard-preview.png"
                                alt="app dashboard"
                                className="shadow rounded-xl"
                            />
                            <div className="absolute -top-4 left-4 bottom-4 -right-4 -z-10 bg-sky-500 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </Container>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 -z-10"></div>
        </div>
    );
}
