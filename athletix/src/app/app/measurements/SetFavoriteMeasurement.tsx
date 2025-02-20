import { APIMeasurement } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import Button from "@/app/components/buttons/Button";
import icons, { animatedIcons } from "@/app/icons";
import notify from "@/app/notify";
import { motion } from "motion/react";
import React, { useState } from "react";

interface SetFavoriteMeasurementProps {
    measurement?: APIMeasurement;
    refreshMeasurements: () => void;
}

export default function SetFavoriteMeasurement({
    measurement,
    refreshMeasurements,
}: SetFavoriteMeasurementProps) {
    const [favoriteBtnDisabled, setFavoriteBtnDisabled] = useState(false);

    const favoriteMeasurement = (id: number, isFavorite: boolean) => {
        const msg =
            isFavorite === true
                ? "Removing from favorites..."
                : "Adding to favorites...";

        const dismissToast = notify({
            text: msg,
            icon: animatedIcons.spinner,
        });
        setFavoriteBtnDisabled(true);

        sendRequest(
            `/users/measurements/favorites`,
            RequestMethod.POST,
            JSON.stringify({
                id: id,
            }),
            async (response: Response) => {
                if (response.ok) {
                    refreshMeasurements();
                }
                dismissToast();
                setFavoriteBtnDisabled(false);
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    return (
        <motion.div
            whileHover={{
                scale: 1.1,
            }}
            whileTap={{
                scale: 0.9,
            }}
        >
            <Button
                variant="circle"
                onClick={() =>
                    favoriteMeasurement(
                        measurement?.id as number,
                        measurement?.is_favorite as boolean
                    )
                }
                disabled={favoriteBtnDisabled}
                className={`bg-white text-pink-400 shadow hover:fill-pink-400 duration-300 ${
                    measurement?.is_favorite ? "fill-pink-400" : "fill-white"
                }`}
            >
                {icons.heart}
            </Button>
        </motion.div>
    );
}
