'use client';

import clsx from "clsx";
import { UserData } from "../lib/definitions";

type TypeSwitchProps = {
    data: UserData;
    sem: number;
    course: string;
    dispatch: Function;
};

export default function TypeSwitch({ data, sem, course, dispatch }: TypeSwitchProps) {
    const change_to_total = () => {
        dispatch({
            type: "convert to total",
            semester: sem,
            course: course,
        });
    };
    
    const change_to_continuous = () => {
        dispatch({
            type: "convert to continuous",
            semester: sem,
            course: course,
        });
    };
        
    return (
        <div className="relative rounded-full flex justify-evenly overflow-hidden border-brownish border my-6">
            <button 
                className={clsx("text-2xl w-full p-0.5 text-center font-cmu", {
                    "bg-brownish text-whiteish": data.semesters[sem][course].mode === "continuous",
                    "bg-transparent text-brownish": data.semesters[sem][course].mode !== "continuous"
                })} 
                onClick={change_to_continuous}>
                {"Continuous"}
            </button>

            <button 
                className={clsx("text-2xl w-full p-0.5 text-center font-cmu", {
                    "bg-brownish text-whiteish": data.semesters[sem][course].mode === "total",
                    "bg-transparent text-brownish": data.semesters[sem][course].mode !== "total"
                })} 
                onClick={change_to_total}>
                {"Total"}
            </button>
        </div>
    );
}
