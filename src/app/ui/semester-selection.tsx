'use client';

import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { semester_GPA, in_range_or_equal_string } from "../lib/calculations";
import { CourseDict, UserData } from "../lib/definitions";

import cs_data_ from "../lib/cs.json";
const cs_data = cs_data_ as CourseDict;

function Semester({ data, semester, currentSemester, setCurrentSemester }: { data: UserData, semester: number, currentSemester: number, setCurrentSemester: Function }) {
    const ref = useRef<null | HTMLButtonElement>(null);

    const handleClick = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth', inline: "center" });
        setCurrentSemester(semester);
        console.log(semester);
    };

    const points_range_string = useMemo(() => 
        in_range_or_equal_string(
            Math.round((semester_GPA(data.semesters[semester], cs_data, false) + Number.EPSILON) * 100) / 100,
            Math.round((semester_GPA(data.semesters[semester], cs_data, true) + Number.EPSILON) * 100) / 100
        ), 
        [data, semester]
    );

    useEffect(() => {
        if (semester === currentSemester) {
            ref.current!.scrollIntoView({ inline: "center" });
        }
    }, []);

    return (
        <button ref={ref} className={clsx("flex-column snap-center align-middle py-8 font-cmu", {
            "opacity-50": currentSemester !== semester
        })} onClick={handleClick}>
            <div className={clsx("min-w-60 text-4xl", {
                "underline text-center": currentSemester === semester
            })}>
                Semester {semester + 1}
            </div>
            <div className="text-2xl opacity-50 text-center">
                GPA {points_range_string}
            </div>
        </button>
    )
}

// 

export type AddSemesterButtonProps = {
    data: UserData;
    dispatch: Function;
    semester: number;
};

export function AddSemesterButton({ data, dispatch, semester }: AddSemesterButtonProps) {
    let handleClick = () => {
        dispatch({
            type: "add semester"
        });
    };

    return (
        <button
            className={clsx("relative text-whiteish text-3xl px-4", {
                "opacity-50": semester === Object.keys(data.semesters).length - 1,
                "opacity-0": semester !== Object.keys(data.semesters).length - 1,
            })}
            onClick={handleClick}>
            Add
        </button>
    )
}

// The bar itself

export type SemesterBarProps = {
    semesters: number;
    semester: number;
    setSemester: Function;
    data: UserData;
    dispatch: Function;
};

export function SemesterBar({ data, semesters, semester, setSemester, dispatch }: SemesterBarProps) {
  return (
    <div className="relative bg-greyblue flex-shrink-0 px-8 overflow-x-scroll snap-x snap-proximity touch-none no-scrollbar">
        <div className="relative flex">
            <div className="relative min-w-full snap-none"></div>
            {
                [...Array(semesters)].map((_, index) => (
                    <Semester data={data} semester={index} currentSemester={semester} setCurrentSemester={setSemester} key={index} />
                ))
            }
            <AddSemesterButton {...{data, dispatch, semester}} />
            <div className="relative min-w-full snap-none"></div>
        </div>
    </div>
  );
}
