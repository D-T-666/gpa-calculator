'use client';

import { ChangeEvent } from "react";
import { course_GP, points_to_GP } from "../lib/calculations";
import { CourseDict, UserData } from "../lib/definitions";

import cs_data_ from "../lib/cs.json";
const cs_data = cs_data_ as CourseDict;

export default function TotalPoints({ data, sem, course, dispatch }: { data: UserData, sem: number, course: string, dispatch: Function }) {
    const change_handler = (e: ChangeEvent<HTMLInputElement>) => {
      console.log(e);
      dispatch({
        type: "update total points",
        semester: sem,
        course: course,
        points: Number(e.target.value) || null
      });
    };

    return (
        <div className="relative pb-2 mt-6 flex flex-col items-center w-full text-3xl">
            <input
                className="relative shadow-[inset_0_0_8px_0_rgba(0,0,0,0.1)] text-7xl text-center rounded-lg w-36 pt-3 bg-whiteish font-normal"
                type="number"
                value={ data.semesters[sem][course].total || "" }
                onChange={e => change_handler(e)}
                onWheel={e => (e.target as HTMLElement).blur()}
                min={0}
                max={100}
            />
            <div className="text-brownish text-lg">
              GPA: { data.semesters[sem][course].mode === "total" ? points_to_GP(data.semesters[sem][course].total!) : course_GP(data.semesters[sem][course].syllabus!, cs_data[course].syllabus!) }
            </div>
        </div>
    );
}
