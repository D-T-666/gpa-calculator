'use client';

import { points_to_GP } from "../lib/calculations";
import { UserData } from "../lib/definitions";

import NumberInput from "./number-input";

export default function TotalPoints({ data, sem, course, dispatch }: { data: UserData, sem: number, course: string, dispatch: Function }) {
    const change_handler = (x: number | null) => {
      dispatch({
        type: "update total points",
        semester: sem,
        course: course,
        points: x
      });
    };

    return (
        <div className="relative pb-2 mt-6 flex flex-col items-center w-full text-3xl">
            <NumberInput
                className="relative text-center rounded-lg font-normal text-7xl pt-3 w-36"
                value={data.semesters[sem][course].total !== undefined ? data.semesters[sem][course].total : ""}
                setValue={change_handler}
                min={0}
                max={100}
            />
            <div className="text-brownish text-lg">
              GPA = { data.semesters[sem][course].total ? points_to_GP(data.semesters[sem][course].total!) : "unknown" }
            </div>
        </div>
    );
}
