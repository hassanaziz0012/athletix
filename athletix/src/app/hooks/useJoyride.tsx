import { JSX, useEffect, useState } from "react";
import JoyrideNoSSR from "../JoyrideNoSSR";
import { CallBackProps } from "react-joyride";

type Tutorial = {
    name: string;
    state: "new" | "finished";
};

export const getTutorialState = (name: string) => {
    const tutorial: Tutorial = JSON.parse(
        localStorage.getItem(`tutorial-${name}`) ||
            JSON.stringify({ name: name, state: "new" })
    );
    return tutorial.state;
};

export const restartTutorial = (name: string) => {
    localStorage.removeItem(`tutorial-${name}`);
}

const finishTutorial = (name: string) => {
    const tutorial = JSON.stringify({
        name: name,
        state: "finished",
    });
    localStorage.setItem(`tutorial-${name}`, tutorial);
};

const joyrideCallback = (name: string, { status }: CallBackProps) => {
    if (status === "finished") {
        finishTutorial(name);
    }
};

const useJoyride = (
    name: string,
    steps: { target: string; content: string }[]
): [(props: { continuous?: boolean }) => JSX.Element, () => void] => {
    const [tutorialState, setTutorialState] = useState("");
    const [clientRun, setClientRun] = useState(false);
    const [runJoyride, setRunJoyride] = useState(false);

    useEffect(() => {
        setTutorialState(getTutorialState(name));
    }, [name]);

    useEffect(() => {
        if (tutorialState === "new" && clientRun === true) {
            setRunJoyride(true);
        }
    }, [tutorialState, clientRun]);

    const startJoyride = () => {
        setClientRun(true);
    };

    const JoyrideComponent = ({
        continuous = true,
    }: {
        continuous?: boolean;
    }) => (
        <JoyrideNoSSR
            steps={steps}
            run={runJoyride}
            callback={(props) => joyrideCallback(name, props)}
            continuous={continuous}
        />
    );

    return [JoyrideComponent, startJoyride];
};

export default useJoyride;
