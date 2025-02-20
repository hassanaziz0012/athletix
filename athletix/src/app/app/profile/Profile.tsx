"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import Goals from "./Goals";
import Container from "@/app/components/Container";
import { logout } from "@/app/apiUtils";
import Settings from "./Settings";
import Tutorials from "./Tutorials";

export default function Profile() {
    return (
        <Container>
            <div className="flex flex-col gap-y-6">
                <ProfileCard />
                <Goals />
                <Settings />
                <Tutorials />
                <div className="p-5 rounded-xl bg-white shadow">
                    <button
                        className="text-rose-500 border-b border-b-rose-500 py-3 px-6 duration-300 hover:bg-rose-50 active:bg-rose-100 rounded-t-md"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </Container>
    );
}
