
export type GradeItem = {
    max_points: number;
    points?: number;
    threshold?: number;
};

export type GradeGroup = {
    drop: number;
    items: {
        [name: string]: GradeItem;
    };
};

export type Curriculum = {
    [name: string]: GradeGroup;
};

export type Course = {
    credits: number;
    mode: "total" | "continuous";
    curriculum?: Curriculum;
    total?: number;
};

export type Semester = {
    [title: string]: Course;
};

export type Semesters = {
    [sem: number]: Semester;
};

export type DataUpdateAction = {
    type: "update continuous points";
    semester: number;
    course: string;
    group: string;
    item: string;
    points: number | null;
} | {
    type: "update total points";
    semester: number;
    course: string;
    points: number | null;
} | {
    type: "convert to total";
    semester: number;
    course: string;
} | {
    type: "convert to continuous";
    semester: number;
    course: string;
};