'use client';

import clsx from "clsx";
import { CourseDict, GradeGroup, GradeItem, UserData } from "../lib/definitions";
import Image from "next/image";
import { useMemo, useState } from "react";
import GradedEvent from "./graded-event";
import { grade_group_points, in_range_or_equal_string } from "../lib/calculations";

import cs_data_ from "../lib/cs.json";
const cs_data = cs_data_ as CourseDict;

export default function GradeGroup({ data, sem, course, group, dispatch }: { data: UserData, sem: number, course: string, group: string, dispatch: Function }) {
  const [unfolded, setUnfolded] = useState(false);

  const points_range_string = useMemo(() =>
    in_range_or_equal_string(
        grade_group_points(data.semesters[sem][course].syllabus![group], cs_data[course].syllabus![group], false),
        grade_group_points(data.semesters[sem][course].syllabus![group], cs_data[course].syllabus![group], true)
    ),
    [data, sem, course, group]
  );

  return (
    <div className="relative my-4 flex-column font-normal">
        <div className="relative flex">
            <button className={clsx("relative w-6 ml-4 text-brownish text-center transition", {
                "-rotate-90": !unfolded
            })} onClick={() => setUnfolded(!unfolded)}>
                <Image
                    priority
                    src="/gpa-calculator/arrow.svg"
                    alt="Follow us on Twitter"
                    fill={true}
                />
            </button>
            <label className="relative text-3xl flex-grow text-center font-cmu">
                {group}
            </label>
            <div className="relative w-6 mr-4"></div>
        </div>
        <div className={clsx("transition-all duration-500", {"opacity-100 max-h-[200em]": unfolded, "opacity-0 max-h-[0em]": !unfolded})}>
        {
            unfolded ? <>
                <div className="text-center duration text-brownish w-full text-xl my-1 font-cmu">
                    total {points_range_string}
                </div>
                <hr className="border-brownish"/>
                {
                    Object.keys(data.semesters[sem][course].syllabus![group]).map((item, index) =>
                        <GradedEvent {...{data, sem, course, group, dispatch, item}} key={index} />
                    )
                }
            </> : null
        }
        </div>
    </div>
  );
}
