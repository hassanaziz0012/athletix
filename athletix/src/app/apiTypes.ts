export type APIWorkout = {
    id: number;
    name: string;
    creation_date: string;
    performed_date: string;
    note: string;
    exercises: WorkoutExercise[];
    volume: UnitValue;
    prs: number;
    is_template: boolean;
};

export type APITemplate = {
    id: number;
    workout: APIWorkout;
    schedule: TemplateSchedule;
    days: TemplateDay[];
};

export type APIMeasurement = {
    id: number;
    label: string;
    records?: APIMeasurementRecord[];
    is_favorite: boolean;
};

export type APIMeasurementRecord = {
    id: number;
    value: UnitValue;
    date: string;
};

export type APIProfile = {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profilePicture: string;
    use_kg: boolean;
};

export enum TemplateSchedule {
    Daily = "daily",
    Weekly = "weekly",
    Biweekly = "biweekly",
}

export enum TemplateDay {
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
    Sunday = "sunday",
}

export type Set = {
    id?: number;
    weight: UnitValue;
    reps: number;
    duration?: string;
    type: string;
    order?: number;
    tags?: string[];
};

export enum SetTagIcon {
    BestSet = "🏆",
}

export type APIGoal = {
    id: number;
    text: string;
    description: string;
    finished: boolean;
};

export type Exercise = {
    id: number;
    name: string;
    body_part: BodyPart;
    stats?: ExerciseStats;
    is_custom: boolean;
};

export enum BodyPart {
    Core = "Core",
    Arms = "Arms",
    Back = "Back",
    Chest = "Chest",
    Legs = "Legs",
    Shoulders = "Shoulders",
    Other = "Other",
    Olympic = "Olympic",
    FullBody = "Full body",
    Cardio = "Cardio",
}

export const bodyPartIcons: { [key in BodyPart]: string | undefined } = {
    [BodyPart.Core]: "/icons/muscles/abs.png",
    [BodyPart.Arms]: "/icons/muscles/biceps.png",
    [BodyPart.Back]: "/icons/muscles/back.png",
    [BodyPart.Chest]: "/icons/muscles/chest.png",
    [BodyPart.Legs]: "/icons/muscles/quads.png",
    [BodyPart.Shoulders]: "/icons/muscles/shoulder.png",

    [BodyPart.Other]: undefined,
    [BodyPart.Olympic]: undefined,
    [BodyPart.FullBody]: undefined,
    [BodyPart.Cardio]: undefined,

    // [BodyPart.Other]: "./icons/muscles/other.png",
    // [BodyPart.Olympic]: "./icons/muscles/olympic.png",
    // [BodyPart.FullBody]: "./icons/muscles/full-body.png",
    // [BodyPart.Cardio]: "./icons/muscles/bicycle.png",
};

export type UnitValue = {
    unit: string;
    value: number
}

export type ExerciseStats = {
    estimated_1rm: UnitValue;
    max_weight: UnitValue;
    max_vol: UnitValue;
};

export type WorkoutExercise = {
    id?: number;
    name: string;
    reps_or_duration: "reps" | "duration";
    note?: string;
    exercise?: number;
    sets: Set[];
};

export const setTypes = {
    normal: {
        symbol: "N",
        label: "Normal",
        classes: {
            bg: "bg-sky-100",
            hover: "hover:bg-sky-100",
            text: "text-sky-700",
            all: () =>
                `${setTypes.normal.classes.bg} ${setTypes.normal.classes.hover} ${setTypes.normal.classes.text}`,
        },
    },
    warmup: {
        symbol: "W",
        label: "Warmup",
        classes: {
            bg: "bg-amber-100",
            hover: "hover:bg-amber-100",
            text: "text-amber-700",
            all: () =>
                `${setTypes.warmup.classes.bg} ${setTypes.warmup.classes.hover} ${setTypes.warmup.classes.text}`,
        },
    },
    cooldown: {
        symbol: "C",
        label: "Cooldown",
        classes: {
            bg: "bg-rose-100",
            hover: "hover:bg-rose-100",
            text: "text-rose-700",
            all: () =>
                `${setTypes.cooldown.classes.bg} ${setTypes.cooldown.classes.hover} ${setTypes.cooldown.classes.text}`,
        },
    },
    dropset: {
        symbol: "D",
        label: "Dropset",
        classes: {
            bg: "bg-violet-100",
            hover: "hover:bg-violet-100",
            text: "text-violet-700",
            all: () =>
                `${setTypes.dropset.classes.bg} ${setTypes.dropset.classes.hover} ${setTypes.dropset.classes.text}`,
        },
    },
    failure: {
        symbol: "F",
        label: "Failure",
        classes: {
            bg: "bg-red-100",
            hover: "hover:bg-red-100",
            text: "text-red-700",
            all: () =>
                `${setTypes.failure.classes.bg} ${setTypes.failure.classes.hover} ${setTypes.failure.classes.text}`,
        },
    },
};
