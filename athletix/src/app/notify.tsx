import { IconProps, toast } from "react-toastify";
import React, { ReactElement, ReactNode } from "react";

type ToastIcon =
    | false
    | ((props: IconProps) => ReactNode)
    | ReactElement<IconProps>;

interface NotifyProps {
    text: string;
    type?: "info" | "success" | "warning" | "error" | "default";
    autoClose?: number | false;
    icon?: ToastIcon;
}

const notify = ({
    text,
    type = "info",
    autoClose = false,
    icon,
}: NotifyProps) => {
    const toastId = toast(<div className="ml-2">{text}</div>, {
        type,
        autoClose,
        position: "bottom-right",
        icon: icon,
    });

    const dismiss = () => toast.dismiss(toastId);

    return dismiss;
};

export default notify;
