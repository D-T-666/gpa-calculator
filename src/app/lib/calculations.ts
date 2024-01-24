import { Curriculum, GradeGroup, Semester, Semesters } from "./definitions";

export function pointsToGP(points: number): number {
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

export function calculatePointsGradeGroup(grade_group: GradeGroup, max: boolean = false): number {
    return Object
        .values(grade_group.items)
        .map((a) => a.points || (max ? a.max_points : 0))
        .sort((a, b) => a - b)
        .slice(grade_group.drop)
        .reduce((a, v) => a + v);
}

export function calculatePoints(course: Curriculum, max: boolean = false): number {
    let points = 0;

    for (let grade_group of Object.values(course)) {
        points += calculatePointsGradeGroup(grade_group, max);
    }

    return points;
}

function calculateTotalCreditsSemester(sem: Semester): number {
    let res = 0;

    for (let {credits} of Object.values(sem)) {
        res += credits;
    }

    return res;
}

export function calculateGPASemester(sem: Semester, max: boolean = false): number {
    let acc = 0;
    let total_credits = 0;

    for (let {credits, mode, curriculum, total} of Object.values(sem)) {
        if (mode === "total") {
            acc += credits * pointsToGP(total!);
        } else {
            acc += credits * pointsToGP(calculatePoints(curriculum!, max));
        }
        total_credits += credits;
    }

    return acc / total_credits;
}

export function calculateGPASemesters(semesters: Semesters, max: boolean = false): number {
    let total_credits = 0;
    let acc = 0;

    for (let sem of Object.values(semesters)) {
        acc += calculateGPASemester(sem, max) * calculateTotalCreditsSemester(sem);
        total_credits += calculateTotalCreditsSemester(sem);
    }

    return acc / total_credits;
}

export function inRangeOrEqualString(a: number, b: number): string {
    return a !== b 
        ? `∈ [${a}, ${b}]`
        : `= ${a}`
}