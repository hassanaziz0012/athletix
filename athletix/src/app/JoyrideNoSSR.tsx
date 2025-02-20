import dynamic from "next/dynamic";

const JoyrideNoSSR = dynamic(() => import("react-joyride"), {
    ssr: false,
});

export default JoyrideNoSSR;