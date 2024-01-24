'use client';

import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { Semesters } from "../lib/definitions";
import { calculateGPASemester, inRangeOrEqualString } from "../lib/calculations";

function Semester({ data, semester, currentSemester, setCurrentSemester }: { data: Semesters, semester: number, currentSemester: number, setCurrentSemester: Function }) {
    const ref = useRef<null | HTMLButtonElement>(null);

    const handleClick = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth', inline: "center" });
        setCurrentSemester(semester);
        console.log(semester);
    };

    const points_range_string = useMemo(() => 
        inRangeOrEqualString(
            Math.round((calculateGPASemester(data[semester], false) + Number.EPSILON) * 100) / 100,
            Math.round((calculateGPASemester(data[semester], true) + Number.EPSILON) * 100) / 100
        ), 
        [data, semester]
    );

    useEffect(() => {
        if (semester === currentSemester) {
            ref.current!.scrollIntoView({ inline: "center" });
        }
    }, []);

    return (
        <button ref={ref} className={clsx("min-w-60 flex-column snap-center align-middle py-8 font-cmu", {
            "opacity-25": currentSemester !== semester
        })} onClick={handleClick}>
            <div className="text-4xl underline text-center">
                Semester {semester + 1}
            </div>
            <div className="text-2xl opacity-50 text-center">
                GPA {points_range_string}
            </div>
        </button>
    )
}

export default function SemesterSelection({ data, semesters, semester, setSemester }: { semesters: number, semester: number, data: Semesters, setSemester: Function }) {
  return (
    <div className="relative bg-greyblue flex-shrink-0 px-8 overflow-x-scroll snap-x snap-proximity touch-none no-scrollbar">
        <div className="relative flex">
            <div className="relative min-w-full snap-none"></div>
            {
                [...Array(semesters)].map((_, index) => (
                    <Semester data={data} semester={index} currentSemester={semester} setCurrentSemester={setSemester} key={index} />
                ))
            }
            <div className="relative min-w-full snap-none"></div>
        </div>
    </div>
  );
}
