'use client';

import { ChangeEvent } from "react";
import { Semesters } from "../lib/definitions";
import { pointsToGP } from "../lib/calculations";

export default function TotalPoints({ data, sem, course, dispatch }: { data: Semesters, sem: number, course: string, dispatch: Function }) {
    const change_handler = (e: ChangeEvent<HTMLInputElement>) => {
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
                value={ data[sem][course].total || "" }
                onChange={e => change_handler(e)} 
                onWheel={e => (e.target as HTMLElement).blur()}
                min={0}
                max={100}
            />
            {/* // <div className="text-7xl m-6">
            //   { data[sem][course].total !== null ? data[sem][course].total : ""}
            // </div> */}
            <div className="text-brownish text-lg">
              GPA: { pointsToGP(data[sem][course].total || 0) }
            </div>
        </div>
    );
}
