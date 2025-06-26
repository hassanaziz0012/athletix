"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile } from "@/app/apiUtils";
import { APIProfile } from "@/app/apiTypes";

export default function ProfileIcon({ showName }: { showName: boolean }) {
    // const [active, toggleDropdown] = useDropdown("button");
    const [profile, setProfile] = useState<APIProfile>();

    useEffect(() => {
        getProfile(setProfile);
    }, []);

    return (
        <Link href={"/app/profile"} className={`flex items-center gap-x-2 w-full rounded-xl py-3 duration-300 ${showName === true && "p-3 bg-slate-600"}`}>
            <img
                src={profile?.profilePicture || "/images/blank-profile.png"}
                alt="profile"
                className="sm:min-w-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover object-center border"
            />
            <span className={`${showName === true ?  "opacity-100" : "opacity-0"} hidden sm:block duration-300 delay-150`}>
                {showName && profile?.firstName + " " + profile?.lastName}
            </span>
        </Link>
    );
}
