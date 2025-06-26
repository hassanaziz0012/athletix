import LoginForm from "@/app/components/forms/LoginForm";
import Page from "@/app/components/pages/Page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Login | Athletix",
    description: "Your all-in-one workout companion",
}

export default function LoginPage() {
    return (
        <Page>
            <div className="flex justify-center items-center m-10">
                <LoginForm />
            </div>
        </Page>
    );
}
