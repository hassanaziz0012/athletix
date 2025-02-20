"use client";
import { APIProfile } from "@/app/apiTypes";
import { getProfile, RequestMethod, sendRequest } from "@/app/apiUtils";
import icons from "@/app/icons";
import React, { useEffect, useState } from "react";

export default function ProfileCard() {
    const [profile, setProfile] = useState<APIProfile>();

    const [editOn, setEditOn] = useState(false);

    const defaultImage = "/images/blank-profile.png";

    const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (profile) {
            setProfile({ ...profile, [name]: value });
        }
    };

    const updateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditOn(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (profile) {
                    setProfile({
                        ...profile,
                        profilePicture: reader.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = () => {
        sendRequest(
            "/users/profile",
            RequestMethod.PATCH,
            JSON.stringify({
                first_name: profile?.firstName,
                last_name: profile?.lastName,
                username: profile?.username,
                email: profile?.email,
                profile_picture: profile?.profilePicture,
            }),
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setEditOn(false);
            },
            async (response: Response) => {
                console.error("Error fetching profile:", response);
            }
        );
    };

    useEffect(() => {
        getProfile(setProfile);
    }, []);

    return (
        <div className="p-5 bg-white rounded-xl shadow">
            <div className="flex gap-x-6">
                <div className="relative overflow-hidden rounded-full group min-w-32 w-32 h-32">
                    <img
                        src={profile?.profilePicture || defaultImage}
                        alt=""
                        className="w-32 h-32 rounded-full object-center object-cover"
                    />

                    <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-slate-800 bg-opacity-70 text-white flex items-center justify-center translate-y-full group-hover:translate-y-0 duration-300">
                        <label
                            htmlFor="profilePicture"
                            className="p-2 rounded-full bg-slate-900 shadow hover:cursor-pointer"
                        >
                            {icons.upload}
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            id="profilePicture"
                            name="profilePicture"
                            className="hidden"
                            onChange={updateImage}
                        />
                    </div>
                </div>

                {editOn ? (
                    <div className="flex flex-col justify-between items-start">
                        <div className="flex flex-col gap-y-4">
                            <fieldset className="flex flex-col gap-y-2">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="mb-2 rounded-md border px-2 py-1 inline-block"
                                    value={profile?.username}
                                    onChange={updateField}
                                />
                            </fieldset>
                            <fieldset className="flex flex-col gap-y-2">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    className="mb-2 rounded-md border px-2 py-1"
                                    value={profile?.email}
                                    onChange={updateField}
                                />
                            </fieldset>
                            <div>
                                <button
                                    onClick={saveProfile}
                                    className="px-4 py-2 rounded-md bg-slate-800 text-white flex items-center gap-x-2"
                                >
                                    {icons.edit}
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-between items-start">
                        <div>
                            <p className="text-2xl mb-2">{profile?.username}</p>
                            <p className="text-slate-600">{profile?.email}</p>
                        </div>

                        <button
                            onClick={() => setEditOn(true)}
                            className="px-4 py-2 rounded-md bg-slate-800 text-white flex items-center gap-x-2"
                        >
                            {icons.edit}
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
