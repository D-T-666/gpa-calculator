'use client';

import { useState } from "react";
import { Semesters } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";

export default function Card({ data, sem, course, dispatch }: { course: string; data: Semesters, sem: number, dispatch: Function }) {
  return (
    <div className="relative rounded-3xl bg-whiteish max-w-[12em] w-full text-black p-8 pb-0 text-5xl font-cmu shadow-[0_1rem_2rem_0_rgba(0,0,0,0.2)]">
        <h1 className="my-2">
            {course}
        </h1>
        {
            data[sem][course].curriculum !== undefined
            ? <TypeSwitch {...{data, sem, course, dispatch}} />
            : <></>
        }
        {
            data[sem][course].mode === "continuous"
            ?   <div className="pb-4"> 
                    { Object.keys(data[sem][course].curriculum!).map((group, i) => 
                        <GradeGroup {...{data, sem, course, group, dispatch}} key={i}/>
                    ) }
                </div>
            :   <TotalPoints {...{data, sem, course, dispatch}} />
        }
    </div>
  );
}
