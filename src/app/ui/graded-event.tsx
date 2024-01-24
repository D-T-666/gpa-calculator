'use client';

import { ChangeEvent } from "react";
import { Semesters } from "../lib/definitions";

export default function GradedEvent({ data, sem, course, group, item, dispatch }: { data: Semesters, sem: number, course: string, group: string, item: string, dispatch: Function }) {
  const change_handler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      semester: sem,
      course: course,
      group: group,
      item: item,
      type: "update continuous points",
      points: Number(e.target.value) || null
    });
  };

  return (
    <div className="relative my-4 flex text text-3xl pl-2 pr-6 items-center">
      <div className="font-cmu flex-grow">
        {item}
      </div>
      <input 
        className="shadow-[inset_0_0_8px_0_rgba(0,0,0,0.1)] w-12 h-10 pt-1 -translate-y-0.5 rounded-lg text-right px-1 bg-whiteish font-normal" 
        type="number" 
        value={data[sem][course].curriculum![group].items[item].points || ""} 
        onChange={e => change_handler(e)} 
        min={0}
        max={data[sem][course].curriculum![group].items[item].max_points}
      />
      /{data[sem][course].curriculum![group].items[item].max_points}
    </div>
  );
}
