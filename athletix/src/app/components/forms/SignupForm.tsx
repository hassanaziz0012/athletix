"use client";
import React, { useState } from "react";
import Link from "next/link";
import { loginUser, RequestMethod, sendRequest } from "@/app/apiUtils";
import PrimaryButton from "../buttons/PrimaryButton";
import { animatedIcons } from "@/app/icons";

const SignupForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [fieldErrors, setFieldErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [waitingForApi, setWaitingForApi] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaitingForApi(true);
        sendRequest(
            "/users/register",
            RequestMethod.POST,
            JSON.stringify(formData),
            async (response: Response) => {
                const data = await response.json();
                setFieldErrors({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                const token = data.token;
                loginUser(token);
                setWaitingForApi(false);
            },
            async (response: Response) => {
                const data = await response.json();
                const errors = data;
                Object.keys(errors).forEach((key) => {
                    setFieldErrors((prev) => ({
                        ...prev,
                        [key]: errors[key][0],
                    }));
                });
                setWaitingForApi(false);
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-5 bg-white rounded-xl shadow-md flex flex-col gap-y-6"
        >
            <div className="flex flex-wrap gap-6">
                <div className="basis-0 grow flex flex-col gap-y-2">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="p-2 rounded border bg-slate-50 w-full min-w-48"
                        required
                    />
                    <p className="text-rose-500">{fieldErrors.firstName}</p>

                    {/* <TextInput
                        label={"First Name"}
                        name={"firstName"}
                        value={formData.firstName}
                        onChange={handleChange}
                        error={fieldErrors.firstName}
                    /> */}
                </div>
                <div className="basis-0 grow flex flex-col gap-y-2">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="p-2 rounded border bg-slate-50 w-full min-w-48"
                        required
                    />
                    <p className="text-rose-500">{fieldErrors.lastName}</p>

                    {/* <TextInput
                        label={"Last Name"}
                        name={"lastName"}
                        value={formData.lastName}
                        onChange={handleChange}
                        error={fieldErrors.lastName}
                    /> */}
                </div>
            </div>
            <div className="flex flex-col gap-y-2">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="p-2 rounded border bg-slate-50 w-full min-w-48"
                    required
                />
                <p className="text-rose-500">{fieldErrors.email}</p>

                {/* <TextInput
                    label={"Email"}
                    name={"email"}
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    error={fieldErrors.email}
                /> */}
            </div>
            <div className="flex flex-wrap gap-6">
                <div className="basis-0 grow flex flex-col gap-y-2">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-2 border rounded bg-slate-50 w-full min-w-48"
                        required
                    />
                    <p className="text-rose-500">{fieldErrors.password}</p>

                    {/* <TextInput
                        label={"Password"}
                        name={"password"}
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        error={fieldErrors.password}
                    /> */}
                </div>
                <div className="basis-0 grow flex flex-col gap-y-2">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="p-2 border rounded bg-slate-50 w-full min-w-48"
                        required
                    />
                    <p className="text-rose-500">
                        {fieldErrors.confirmPassword}
                    </p>

                    {/* <TextInput
                        label={"Confirm Password"}
                        name={"confirmPassword"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type="password"
                        error={fieldErrors.confirmPassword}
                    /> */}
                </div>
            </div>

            <div className="flex gap-x-4 items-center">
                <PrimaryButton
                    disabled={waitingForApi}
                    type="submit"
                    onClick={() => {}}
                    className="grow"
                >
                    Sign Up
                </PrimaryButton>

                {waitingForApi && animatedIcons.spinner}
            </div>

            <div className="text-sky-600 mt-2">
                <Link href="/auth/login">Or log in instead?</Link>
            </div>
        </form>
    );
};

export default SignupForm;
