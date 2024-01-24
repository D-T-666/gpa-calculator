'use client';

import { useMemo, useState } from "react";
import { Semesters } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";
import { calculateGPASemesters, inRangeOrEqualString } from "../lib/calculations";
import Image from "next/image";

export default function Header({ data }: { data: Semesters }) {
    let total_gpa_string = useMemo(
        () => inRangeOrEqualString(
            Math.round((calculateGPASemesters(data, false) + Number.EPSILON) * 100) / 100,
            Math.round((calculateGPASemesters(data, true) + Number.EPSILON) * 100) / 100
        ),
        [data]
    );

    return (
        <div className="relative text-2xl font-cmu text-center p-8 pb-0 opacity-50 flex">
            <button className="relative w-8 text-brownish text-center rotate-90" onClick={() => {}}>
                <Image
                    priority
                    src="/arrow.svg"
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
