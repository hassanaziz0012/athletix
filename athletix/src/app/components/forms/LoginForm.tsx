"use client";
import React, { useState } from "react";
import Link from "next/link";
import { loginUser, RequestMethod, sendRequest } from "@/app/apiUtils";
import PrimaryButton from "../buttons/PrimaryButton";
import { animatedIcons } from "@/app/icons";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [waitingForApi, setWaitingForApi] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaitingForApi(true);
        sendRequest(
            "/users/login",
            RequestMethod.POST,
            JSON.stringify(formData),
            async (response: Response) => {
                const data = await response.json();
                const token = data.token;
                if (response.ok) {
                    setError("");
                    loginUser(token);
                }
                setWaitingForApi(false);
            },
            async (response: Response) => {
                const data = await response.json();
                if (response.status === 401) {
                    setError(data.error);
                }
                setWaitingForApi(false);
                // const errors = data;
                // Object.keys(errors).forEach((key) => {
                //     setFieldErrors((prev) => ({
                //         ...prev,
                //         [key]: errors[key][0],
                //     }));
                // });
            },
            false
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-5 bg-white rounded-xl shadow-md flex flex-col gap-y-6"
        >
            <div className="min-w-64 flex flex-col gap-y-2">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="border rounded-md p-2 bg-slate-50"
                    required
                />
            </div>
            <div className="min-w-64 flex flex-col gap-y-2">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="border rounded-md p-2 bg-slate-50"
                    required
                />
            </div>
            <div className="text-rose-500 mb-2">{error}</div>

            <div className="flex gap-x-4 items-center">
                <PrimaryButton
                    type="submit"
                    disabled={waitingForApi}
                    onClick={() => {}}
                    className="grow"
                >
                    Log in
                </PrimaryButton>
                {waitingForApi && animatedIcons.spinner}
            </div>
            <div className="mt-2 text-sky-600">
                <Link href="/auth/signup">Or sign up instead?</Link>
            </div>
        </form>
    );
};

export default LoginForm;
