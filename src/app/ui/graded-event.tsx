'use client';

import { CourseDict, UserData } from "../lib/definitions";

import cs_data_ from "../lib/cs.json";
import NumberInput from "./number-input";
const cs_data = cs_data_ as CourseDict;

export type GradedEventProps = {
  data: UserData,
  sem: number,
  course: string,
  group: string,
  item: string,
  dispatch: Function
};


export default function GradedEvent({ data, sem, course, group, item, dispatch }: GradedEventProps) {
  const change_handler = (x: number | null) => {
    dispatch({
      semester: sem,
      course: course,
      group: group,
      item: item,
      type: "update continuous points",
      points: x
    });
  };

  return (
    <div className="relative my-4 flex text text-xl px-2 items-center">
      <div className="font-cmu flex-grow">
        {item}
      </div>
      <NumberInput
        className="w-10 h-8 pt-1 -translate-y-0.5 rounded-lg text-right px-1 bg-whiteish font-normal"
        value={data.semesters[sem][course].syllabus![group][item] !== undefined ? data.semesters[sem][course].syllabus![group][item] : ""}
        setValue={change_handler}
        min={0}
        max={cs_data[course].syllabus![group].items[item].max_points}
      />
      /{cs_data[course].syllabus![group].items[item].max_points}
    </div>
  );
}
