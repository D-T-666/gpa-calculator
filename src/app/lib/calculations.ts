import { Course, CourseDict, Curriculum, GradeGroup, UserCourseData, UserCurriculumData, UserData, UserSemesterData } from "./definitions";

export function points_to_GP(points: number): number {
    if (points < 51) return 0;
    else if (points < 56) return 0.5;
    else if (points < 61) return 0.8;
    else if (points < 64) return 1.0;
    else if (points < 68) return 1.3;
    else if (points < 71) return 1.6;
    else if (points < 74) return 1.9;
    else if (points < 78) return 2.2;
    else if (points < 81) return 2.5;
    else if (points < 85) return 2.8;
    else if (points < 88) return 3.1;
    else if (points < 91) return 3.4;
    else if (points < 94) return 3.7;
    else return 4.0;
}

export function grade_group_points(user_data: { [item_name: string]: number | null }, group_data: GradeGroup, max: boolean = false): number {

    return Object
        .entries(user_data)
        .map(([key, value]) => value || (max ? group_data.items[key].max_points : 0))
        .sort((a, b) => a - b)
        .slice(group_data.drop)
        .reduce((a, v) => a + v);
}

export function course_points(user_course: UserCurriculumData, curriculum: Curriculum, max: boolean = false): number {
    let points = 0;
    for (let group_name of Object.keys(user_course)) {
        points += grade_group_points(user_course[group_name], curriculum[group_name], max);
    }
    return points;
}

export function course_GP(user_course: UserCurriculumData, course_curruculum: Curriculum, max: boolean = false): number {
    return points_to_GP(course_points(user_course, course_curruculum, max));
}

function semester_total_credits(user_semester: UserSemesterData, courses: CourseDict): number {
    let res = 0;

    for (let key of Object.keys(user_semester)) {
        res += courses[key].credits;
    }

    return res;
}

export function semester_GPA(user_semester: UserSemesterData, courses: CourseDict, max: boolean = false): number {
    let acc = 0;
    let total_credits = 0;

    for (let course_name of Object.keys(user_semester)) {
        if (user_semester[course_name].mode === "total") {
            acc += courses[course_name].credits * points_to_GP(user_semester[course_name].total!);
        } else {
            acc += courses[course_name].credits * points_to_GP(course_points(user_semester[course_name].curriculum!, courses[course_name].curriculum!, max));
        }
        total_credits += courses[course_name].credits;
    }

    return acc / total_credits;
}

export function total_GPA(user_data: UserData, courses: CourseDict, max: boolean = false): number {
    let total_credits = 0;
    let acc = 0;

    for (let [sem, sem_data] of Object.entries(user_data.semesters)) {
        acc += semester_GPA(sem_data, courses, max) * semester_total_credits(sem_data, courses);
        total_credits += semester_total_credits(sem_data, courses);
    }

    return acc / total_credits;
}

/** Given two numbers a and b produces a string.
 * - If a = b the string will look like "= a".
 * - If a ≠ b the string will look like "∈ [a, b]".
 */
export function in_range_or_equal_string(a: number, b: number): string {
    if (b < a) {
        let t = b;
        b = a;
        a = t;
    }

    return a !== b 
        ? `∈ [${a}, ${b}]`
        : `= ${a}`
}

export function available_courses(user_data: UserData, semester: number, courses: CourseDict): string[] {
    let not_eligible = [];

    for (let [sem, sem_data] of Object.entries(user_data.semesters)) {
        for (let [course, course_data] of Object.entries(sem_data)) {
            // let points = course_data.mode === "total"
            //     ? course_data.total!
                // : course_points(course_data.curriculum!, courses[course].curriculum!);
            
            if (Number(sem) === semester) {
                not_eligible.push(course);
            }
        }
    }

    let available = [];

    for (let [course, course_data] of Object.entries(courses)) {
        if ((course_data.parity === "fall") === (semester % 2 !== 0)) 
            continue;

        if (not_eligible.indexOf(course) === -1) {
            let valid = true;
            if (course_data.pre_requisites !== undefined) {
                for (let pre_requisite of course_data.pre_requisites!) {
                    valid &&= not_eligible.indexOf(pre_requisite) !== -1;
                }
            }
            if (valid) {
                available.push(course);
            }
        }
    }

    return available;
}