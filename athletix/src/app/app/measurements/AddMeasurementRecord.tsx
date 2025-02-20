import { getTodayDate, RequestMethod, sendRequest } from "@/app/apiUtils";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import DateInput from "@/app/components/forms/DateInput";
import TextInput from "@/app/components/forms/TextInput";
import Modal from "@/app/components/Modal";
import icons from "@/app/icons";
import React, { useState } from "react";

interface AddMeasurementRecordProps {
    label: string;
    heading: string;
    unit: string;
    refreshMeasurements: () => void;
}

export default function AddMeasurementRecord({
    label,
    heading,
    unit,
    refreshMeasurements,
    
}: AddMeasurementRecordProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [date, setDate] = useState(getTodayDate());
    const [value, setValue] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(false);

    const closeModal = () => setModalOpen(false);
    const enableBtn = () => setBtnDisabled(false);

    const save = () => {
        setBtnDisabled(true);
        sendRequest(
            "/users/measurements",
            RequestMethod.POST,
            JSON.stringify({
                label: label,
                date: date,
                value: {
                    value: value,
                    unit: unit
                },
            }),
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                closeModal();
                enableBtn();
                refreshMeasurements();
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    return (
        <div>
            <PrimaryButton
                type="button"
                variant="circle"
                onClick={() => setModalOpen(true)}
            >
                {icons.add}
            </PrimaryButton>

            <Modal modalState={[modalOpen, setModalOpen]}>
                <div className="p-5 rounded-xl bg-slate-50 shadow z-10">
                    <DateInput
                        label={"Date"}
                        name={"date"}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        error={""}
                    />

                    <TextInput
                        label={heading}
                        name={"value"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        error={""}
                        placeholder={unit}
                    />

                    <div className="flex gap-x-6 items-center justify-between">
                        <PrimaryButton
                            onClick={save}
                            className="flex items-center gap-x-2"
                            disabled={btnDisabled}
                        >
                            {icons.add}
                            Add
                        </PrimaryButton>

                        <button
                            className="text-gray-600 underline"
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
