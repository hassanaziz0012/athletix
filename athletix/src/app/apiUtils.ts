"use client";
import React from "react";
import { baseUrl } from "./apiConfig";
import { APIProfile, APIWorkout, setTypes } from "./apiTypes";
import notify from "./notify";

export const loginUser = (token: string) => {
    localStorage.setItem("token", token);
    window.location.href = "/app/dashboard";
};

export const setDefaultWeightUnit = (value: "kg" | "lb") => {
    localStorage.setItem("defaultUnit", value);
};

export const displayWeightValue = (value: number) => {
    if (value % 1 === 0) {
        return value.toString();
    } else {
        return value.toFixed(2);
    }
}

export const getAuthToken = () => {
    return localStorage.getItem("token");
};

export const getReadableDate = (date: Date) => {
    return `${date.toDateString()} ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"}`;
};

export const getTodayDate = () => {
    return new Date().toISOString().substring(0, 10);
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
};

export enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export const sendRequest = async (
    url: string,
    method = RequestMethod.GET,
    body: string | null,
    handleSuccess: (response: Response) => Promise<void>,
    handleError: (response: Response) => Promise<void>,
    authenticate: boolean = true,
    notifyError?: (text: string) => void
) => {
    try {
        const token = getAuthToken();
        const headers = {
            "Content-Type": "application/json",
            Authorization: token ? `Token ${token}` : "",
        };
        const response = await fetch(`${baseUrl}${url}`, {
            method: method,
            headers: headers,
            body: body,
        });

        if (response.ok) {
            handleSuccess(response);
        } else {
            if (authenticate === true && response.status === 401) {
                logout();
            }
            handleError(response);
        }
    } catch (error) {
        const err = error as Error;
        if (
            err.name === "TypeError" &&
            err.message === "NetworkError when attempting to fetch resource."
        ) {
            notify({
                text: "Server unreachable.",
                type: "error",
                autoClose: 3000,
            });
            if (notifyError) notifyError("Server unreachable.");
        }
        console.error("Error:", error);
    }
};

export const getWorkout = (
    id: string,
    setState: React.Dispatch<React.SetStateAction<APIWorkout | undefined>>
) => {
    sendRequest(
        `/workouts/list?workout_id=${id}`,
        RequestMethod.GET,
        null,
        async (response: Response) => {
            const data = await response.json();
            setState(data);
        },
        async (response: Response) => {
            console.error("Error fetching workouts:", response);
        }
    );
};

export const getProfile = (
    setState: React.Dispatch<React.SetStateAction<APIProfile | undefined>>
) => {
    sendRequest(
        "/users/profile",
        RequestMethod.GET,
        null,
        async (response: Response) => {
            const data = await response.json();
            setDefaultWeightUnit(data.use_kg ? "kg" : "lb");
            setState({
                firstName: data.first_name,
                lastName: data.last_name,
                username: data.username,
                email: data.email,
                profilePicture: data.profile_picture,
                use_kg: data.use_kg,
            });
        },
        async (response: Response) => {
            console.error("Error fetching profile:", response);
        }
    );
};

export const getSetTypeClasses = (typeSymbol: string): string => {
    const setType = Object.keys(setTypes).filter((type) => {
        const setType = setTypes[type as keyof typeof setTypes];
        return setType.symbol === typeSymbol;
    })[0] as keyof typeof setTypes;

    const classes = setType && setTypes[setType].classes.all();
    return classes;
};
