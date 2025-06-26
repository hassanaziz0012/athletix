import { createContext } from "react";

const BreadcrumbContext = createContext({
    value: undefined as BreadcrumbNavItem[] | undefined,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setValue: (val: BreadcrumbNavItem[]) => {},
});

export type BreadcrumbNavItem = {
    name: string;
    link: string;
};

export default BreadcrumbContext;
