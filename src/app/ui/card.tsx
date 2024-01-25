'use client';

import { useState } from "react";
import { CourseDict, UserData } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";

import cs_data_ from "../lib/cs.json";
const cs_data = cs_data_ as CourseDict;

export default function Card({ data, sem, course, dispatch }: { course: string; data: UserData, sem: number, dispatch: Function }) {
  return (
    <div className="relative rounded-3xl bg-whiteish max-w-[28em] w-full text-black p-8 pb-0 font-cmu shadow-[0_1rem_2rem_0_rgba(0,0,0,0.2)]">
        <h1 className="mb-2 text-3xl">
            {course}
        </h1>
        {
            cs_data[course].curriculum !== undefined
            ? <TypeSwitch {...{data, sem, course, dispatch}} />
            : <></>
        }
        {
            data.semesters[sem][course].mode === "continuous"
            ?   <div className="pb-4"> 
                    { Object.keys(data.semesters[sem][course].curriculum!).map((group, i) => 
                        <GradeGroup {...{data, sem, course, group, dispatch}} key={i}/>
                    ) }
                </div>
            :   <TotalPoints {...{data, sem, course, dispatch}} />
        }
    </div>
  );
}
