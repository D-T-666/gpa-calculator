'use client';

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { semester_GPA, in_range_or_equal_string } from "../lib/calculations";
import { CourseDict, UserData } from "../lib/definitions";

import cs_data_ from "../lib/cs.json";
import { useLongPress } from "@uidotdev/usehooks";
const cs_data = cs_data_ as CourseDict;

type SemesterTabProps = {
    data: UserData;
    dispatch: Function;
    index: number;
    activeSemester: number;
    setActiveSemester: Function;
};

function SemesterTab({ data, dispatch, index, activeSemester, setActiveSemester }: SemesterTabProps) {
    const ref = useRef<null | HTMLDivElement>(null);

    const handleClick = () => {
        setActiveSemester(index);
        console.log(index);
    };

    const [options, setOptions] = useState(false);

    const long_press_attrs = useLongPress(
        () => setOptions(!options)
    );

    const handle_delete = () => {
        if (activeSemester === index) {
            setActiveSemester(index - 1);
        }
        dispatch({
            type: "delete semester",
            semester: index
        });
    }

    const points_range_string = useMemo(() => {
            return in_range_or_equal_string(
                Math.round((semester_GPA(data.semesters[index], cs_data, false) + Number.EPSILON) * 100) / 100,
                Math.round((semester_GPA(data.semesters[index], cs_data, true) + Number.EPSILON) * 100) / 100
            ) || 0
        }, 
        [data, index]
    );

    useEffect(() => {
        if (index === activeSemester) {
            ref.current!.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
    }, [activeSemester]);

    return (
        <div className="py-8 h-32 snap-center min-w-60 flex flex-col justify-center items-center"
            ref={ref} 
            >
            <button 
                {...long_press_attrs} 
                className={clsx("w-full flex-column align-middle font-cmu", {
                    "hidden": options,
                    "opacity-50": activeSemester !== index
                })} 
                onClick={handleClick}>

                <div className={clsx("relative text-4xl", { "underline text-center": activeSemester === index })}>
                    Semester {index + 1}
                </div>

                <div className="text-2xl opacity-50 text-center">
                    GPA {points_range_string}
                </div>
            </button>
            <div className={clsx("flex text-xl justify-center space-x-2 items-center border border-whiteish rounded-2xl p-2 w-fit", {
                "hidden": !options,
            })}>

                <button 
                    className="font-cmu text-center w-20 rounded-xl font-bold h-12"
                    onClick={() => setOptions(!options)}>
                    Cancel
                </button>

                <button 
                    className="font-cmu text-center w-20 rounded-xl font-bold bg-redish h-12"
                    onClick={() => handle_delete()}>
                    Delete
                </button>
            </div>
        </div>
    )
}

// 

export type AddSemesterButtonProps = {
    data: UserData;
    dispatch: Function;
    activeSemester: number;
};

export function AddSemesterButton({ data, dispatch, activeSemester }: AddSemesterButtonProps) {
    let handleClick = () => {
        dispatch({
            type: "add semester"
        });
    };

    return (
        <button
            className={clsx("relative text-whiteish text-3xl px-4", {
                "opacity-50": activeSemester === Object.keys(data.semesters).length - 1,
                "opacity-0": activeSemester !== Object.keys(data.semesters).length - 1,
            })}
            onClick={handleClick}>
            Add
        </button>
    )
}

// The bar itself

export type SemesterBarProps = {
    activeSemester: number;
    setActiveSemester: Function;
    data: UserData;
    dispatch: Function;
};

export function SemesterBar({ data, activeSemester, setActiveSemester, dispatch }: SemesterBarProps) {
  return (
    <div className="relative bg-greyblue flex-shrink-0 px-8 overflow-x-scroll snap-x snap-proximity touch-none no-scrollbar">
        <div className="relative flex">
            <div className="relative min-w-full snap-none"></div>
            {
                Object.keys(data.semesters).map((_, index) => (
                    <SemesterTab 
                        {...{data, dispatch, index, activeSemester, setActiveSemester}}
                        key={index} />
                ))
            }
            <AddSemesterButton {...{data, dispatch, activeSemester}} />
            <div className="relative min-w-full snap-none"></div>
        </div>
    </div>
  );
}
