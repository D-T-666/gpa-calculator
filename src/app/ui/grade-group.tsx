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
        <div className="relative flex items-center">
            <button className={clsx("relative w-4 h-4 text-brownish text-center transition", {
                "-rotate-90": !unfolded
            })} onClick={() => setUnfolded(!unfolded)}>
                <Image
                    priority
                    src="/gpa-calculator/arrow.svg"
                    alt="Follow us on Twitter"
                    fill={true}
                />
            </button>
            <label className="relative text-2xl flex-grow ml-4 font-cmu">
                {group}
            </label>
            <div className="relative w-fit text-right text-brownish font-cmu">
              {points_range_string}
            </div>
        </div>

        <div className={clsx("transition-all duration-500", {"opacity-100 max-h-[100em]": unfolded, "opacity-0 max-h-[0em]": !unfolded})}>
        {
            unfolded ? <>
                { // Information about dropped items
                  cs_data[course].syllabus![group].drop > 0 &&
                  <div className="p-2 pb-0 text-brownish text-center">
                    {cs_data[course].syllabus![group].drop} item{cs_data[course].syllabus![group].drop > 1 && "s"} get{cs_data[course].syllabus![group].drop === 1 && "s"} dropped.
                  </div>
                }
                <hr className="border-brownish mx-4 mt-4"/>
                {
                    Object.keys(data.semesters[sem][course].syllabus![group]).map((item, index) =>
                        <GradedEvent {...{data, sem, course, group, dispatch, item}} key={index} />
                    )
                }
                <div className="mb-8"></div>
            </> : null
        }
        </div>
    </div>
  );
}
