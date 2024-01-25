// Main data, not user dependent
export type GradeItem = {
    max_points: number;
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
    parity: "fall" | "spring";
    pre_requisites?: string[];
    curriculum?: Curriculum;
};

export type CourseDict = {
    [course_name: string]: Course;
};

// User dependent data
export type UserCurriculumData = {
    [group_name: string]: {
        [item_name: string]: number | null;
    }
}
export type UserCourseData = {
    mode: "total" | "continuous";
    curriculum?: UserCurriculumData;
    total?: number;
};

export type UserSemesterData = {
    [course_name: string]: UserCourseData;
};

export type UserData = {
    semesters: {
        [semester: number]: UserSemesterData;
    }
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
} | {
    type: "add semester";
} | {
    type: "add course";
    semester: number;
    course: string;
};