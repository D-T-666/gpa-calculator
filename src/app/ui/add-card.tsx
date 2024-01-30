"use client";

import { useState } from "react";
import { CourseDict, UserData } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";

import cs_data_ from "../lib/cs.json";
import { courses_taken_before_semester } from "../lib/calculations";
const cs_data = cs_data_ as CourseDict;

export type AddCardProps = {
  course: string;
  data: UserData;
  sem: number;
  dispatch: Function;
};

export default function AddCard({ data, sem, course, dispatch }: AddCardProps) {
  let handleClick = () => {
    dispatch({
      type: "add course",
      semester: sem,
      course: course,
    });
  };

  return (
    <button
      className="text-whiteish font-cmu border-brownish relative w-full max-w-[28em] rounded-3xl border-2 border-dashed bg-transparent p-4 px-6 text-left shadow-[0_1rem_2rem_0_rgba(0,0,0,0.2)]"
      onClick={handleClick}
    >
      <h1 className="text-2xl">+ {course}</h1>
      <hr className="border-brownish m-2 border-2 border-b-0 border-dashed" />
      <ul className="text-brownish list-disc pl-4">
        <li>
          Worth {cs_data[course].credits} credits.
        </li>
        {cs_data[course].semester > sem && (
          <li>
            Can be taken in advance, usual semester -{" "}
            {cs_data[course].semester + 1}.
          </li>
        )}
        {courses_taken_before_semester(data, sem).indexOf(course) !== -1 && (
          <li>
            Can be taken again.
          </li>
        )}
      </ul>
    </button>
  );
}
