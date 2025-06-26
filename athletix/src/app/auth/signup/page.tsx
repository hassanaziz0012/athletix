import SignupForm from "@/app/components/forms/SignupForm";
import Page from "@/app/components/pages/Page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Signup | Athletix",
    description: "Your all-in-one workout companion",
}

export default function SignupPage() {
    return (
        <Page>
            <div className="flex justify-center items-center m-10">
                <SignupForm />
            </div>
        </Page>
    );
}
