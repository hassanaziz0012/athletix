import React, { useContext } from "react";
import BreadcrumbContext from "../BreadcrumbContext";
import Link from "next/link";

export default function BreadcrumbNav() {
    const { value: breadcrumbs } = useContext(BreadcrumbContext);

    return (
        <div className="inline-block bg-slate-700 px-2 py-1 text-sm rounded">
            <div className="flex items-center gap-x-2">
                {breadcrumbs?.map((breadcrumb, i) => (
                    <div key={i} className={`flex gap-x-2 ${i === breadcrumbs.length - 1 ? "text-slate-100" : "text-slate-400"}`}>
                        <div key={i}>
                            <Link href={breadcrumb?.link} className="">
                                {breadcrumb?.name}
                            </Link>
                        </div>
                        {i < breadcrumbs.length - 1 && (
                            <div>/</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
