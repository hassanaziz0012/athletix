import React from "react";
import RedoTutorial from "./RedoTutorial";

export default function Tutorials() {
    return (
        <div className="p-5 rounded-xl bg-white shadow text-slate-600">
            <h2 className="text-xl mb-6 text-black">Tutorials</h2>

            <p>
                These tutorials run on each screen one-time for new users. If
                you want to redo one of these, just turn them back on. 😊
            </p>

            <div className="flex flex-col gap-y-6 mt-6">
                <RedoTutorial name="dashboard" />
                <RedoTutorial name="welcome-banner" />
                <RedoTutorial name="measurements" />
                <RedoTutorial name="measurement-card" />
            </div>
        </div>
    );
}
