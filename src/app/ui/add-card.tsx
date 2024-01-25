'use client';

import { useState } from "react";
import { UserData } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";

export default function AddCard({ data, sem, course, dispatch }: { course: string; data: UserData, sem: number, dispatch: Function }) {
  let handleClick = () => {
    dispatch({
      type: "add course",
      semester: sem,
      course: course
    })
  }

  return (
    <button 
      className="relative rounded-3xl max-w-[28em] w-full text-whiteish p-4 px-6 font-cmu shadow-[0_1rem_2rem_0_rgba(0,0,0,0.2)] text-left bg-transparent border-whiteish border-dashed border-2"
      onClick={handleClick}>
      <h1 className="text-2xl">
        + {course}
      </h1>
    </button>
  );
}
