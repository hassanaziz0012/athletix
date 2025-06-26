import { useEffect, useState } from "react";

const useLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>();

    useEffect(() => {
        const tokenExists = localStorage.getItem("token") ? true : false;
        setLoggedIn(tokenExists);
    }, []);

    return loggedIn;
};

export default useLoggedIn;