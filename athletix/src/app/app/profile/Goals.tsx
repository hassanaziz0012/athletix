import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { APIGoal } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import icons from "@/app/icons";

export default function Goals() {
    const [goals, setGoals] = useState<APIGoal[]>([]);
    const [text, setText] = useState("");
    const [desc, setDesc] = useState("");
    const [isEditOn, setIsEditOn] = useState(false);

    const getGoals = () => {
        sendRequest(
            "/users/goals",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setGoals(data);
            },
            async (response: Response) => {
                console.error("Error fetching goals:", response);
            }
        );
    };

    const addGoal = () => {
        if (text === "") {
            return;
        }

        sendRequest(
            "/users/goals",
            RequestMethod.POST,
            JSON.stringify({ text, description: desc }),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    getGoals();

                    setText("");
                    setDesc("");
                    setIsEditOn(false);
                }
            },
            async (response: Response) => {
                console.error("Error adding goal:", response);
            }
        );
    };

    const finishGoal = (goal: APIGoal) => {
        sendRequest(
            "/users/goals",
            RequestMethod.PATCH,
            JSON.stringify({
                goal_id: goal.id,
                finished: !goal.finished,
            }),
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    getGoals();
                }
            },
            async (response: Response) => {
                console.error("Error adding goal:", response);
            }
        );
    };

    const clearCompleted = () => {
        sendRequest(
            "/users/goals",
            RequestMethod.DELETE,
            null,
            async (response: Response) => {
                const data = await response.json();
                if (data.success === true) {
                    getGoals();
                }
            },
            async (response: Response) => {
                console.error("Error adding goal:", response);
            }
        );
    };

    useEffect(() => {
        getGoals();
    }, []);

    return (
        <section className="p-5 bg-white shadow rounded-xl">
            <h2 className="text-xl">Fitness Goals</h2>

            <div className="flex flex-col gap-y-4 my-6">
                {goals.length === 0 && (
                    <p className="text-slate-500">No goals yet. Add your first fitness goal now.</p>
                )}
                <AnimatePresence>
                    {goals
                        .sort((a, b) => Number(a.finished) - Number(b.finished))
                        .map((goal) => (
                            <motion.div
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                initial={{ opacity: 0, scale: 0.75 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.5,
                                    transition: {
                                        duration: 0.2,
                                    },
                                }}
                                key={goal.id}
                                className="flex gap-x-2"
                            >
                                <button
                                    onClick={() => finishGoal(goal)}
                                    className={`${
                                        goal.finished
                                            ? "fill-white bg-sky-600"
                                            : "fill-sky-600"
                                    } border-2 border-sky-600 rounded-full w-7 h-7 flex items-center justify-center group`}
                                >
                                    <span
                                        className={`${
                                            goal.finished
                                                ? "visible opacity-100"
                                                : "invisible opacity-0"
                                        } group-hover:visible group-hover:opacity-100 duration-300`}
                                    >
                                        {icons.check}
                                    </span>
                                    {/* {goal.finished ? icons.circleChecked : icons.circle} */}
                                </button>
                                <div
                                    className={`${
                                        goal.finished &&
                                        "text-slate-600 line-through"
                                    }`}
                                >
                                    <p>{goal.text}</p>
                                    <p className="text-slate-600">
                                        {goal.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isEditOn === true && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: "auto" }}
                        exit={{ opacity: 0, scale: 0.5, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <form action="#" className="border rounded-md p-2">
                            <div className="flex gap-x-2">
                                <div className="border-2 border-sky-600 rounded-full w-7 h-7 flex items-center justify-center"></div>

                                <div className="flex flex-col gap-y-2 grow">
                                    <input
                                        type="text"
                                        placeholder="Enter goal..."
                                        value={text}
                                        onChange={(e) =>
                                            setText(e.target.value)
                                        }
                                    />
                                    <textarea
                                        name="desc"
                                        id="desc"
                                        placeholder="Enter description..."
                                        className="w-full"
                                        rows={1}
                                        value={desc}
                                        onChange={(e) =>
                                            setDesc(e.target.value)
                                        }
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end mt-2 gap-x-4">
                                <button
                                    onClick={() => setIsEditOn(false)}
                                    className="text-slate-600 px-2 py-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addGoal}
                                    type="button"
                                    disabled={text === ""}
                                    className="px-2 py-1 rounded text-white bg-sky-600 disabled:bg-sky-300 duration-300"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-x-4">
                <button
                    onClick={() => setIsEditOn(true)}
                    className="text-slate-700 flex items-center gap-x-2 px-2 py-1 bg-slate-200 rounded my-4"
                >
                    {icons.add} Goal
                </button>

                <button
                    onClick={clearCompleted}
                    className="text-slate-500 underline"
                >
                    Clear completed
                </button>
            </div>
        </section>
    );
}
