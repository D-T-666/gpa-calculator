'use client';

import { useMemo, useState } from "react";
import { CourseDict, UserData } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";
import { total_GPA, in_range_or_equal_string } from "../lib/calculations";
import Image from "next/image";

import cs_data_ from "../lib/cs.json";
const cs_data = cs_data_ as CourseDict;

export default function Header({ data }: { data: UserData }) {
    let total_gpa_string = useMemo(
        () => in_range_or_equal_string(
            Math.round((total_GPA(data, cs_data, false) + Number.EPSILON) * 100) / 100,
            Math.round((total_GPA(data, cs_data, true) + Number.EPSILON) * 100) / 100
        ),
        [data]
    );

    return (
        <div className="relative text-2xl font-cmu text-center p-8 pb-0 opacity-50 flex">
            <button className="relative w-8 text-brownish text-center rotate-90" onClick={() => {}}>
                <Image
                    priority
                    src="/gpa-calculator/arrow.svg"
                    alt="Follow us on Twitter"
                    fill={true}
                />
            </button>
            <div className="flex-grow">
                Total GPA {total_gpa_string}
            </div>
            <div className="w-8"></div>
        </div>
    );
}
