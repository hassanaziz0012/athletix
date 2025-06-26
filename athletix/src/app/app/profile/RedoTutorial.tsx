import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import { getTutorialState, restartTutorial } from "@/app/hooks/useJoyride";
import React, { useEffect, useState } from "react";

export default function RedoTutorial({ name}: {name: string}) {
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setFinished(getTutorialState(name) === "finished" ? true : false);
    }, [name])

    const restart = () => {
        restartTutorial(name);
        setFinished(false);
    }

    return (
        <div className="flex items-center gap-x-2">
            <PrimaryButton onClick={restart} disabled={!finished}>
                {finished === true ? "Restart" : "In Progress"}
            </PrimaryButton>
            <p className="capitalize">{name.replace("-", " ")}</p>
        </div>
    );
}
