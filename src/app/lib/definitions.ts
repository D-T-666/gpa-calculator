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

export type Syllabus = {
    [name: string]: GradeGroup;
};

export type Course = {
    credits: number;
    parity: "fall" | "spring";
    min_semester: number;
    pre_requisites?: string[];
    syllabus?: Syllabus;
};

export type CourseDict = {
    [course_name: string]: Course;
};

// User dependent data
export type UserSyllabusData = {
    [group_name: string]: {
        [item_name: string]: number | undefined;
    }
}
export type UserCourseData = {
    mode: "total" | "continuous";
    syllabus?: UserSyllabusData;
    total?: number;
};

export type UserSemesterData = {
    [course_name: string]: UserCourseData;
};

export type UserData = {
    version: string;
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
    type: "delete semester";
} | {
    type: "add course";
    semester: number;
    course: string;
} | {
    type: "delete course";
    semester: number;
    course: string;
};
