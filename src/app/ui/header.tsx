"use client";

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
    () =>
      in_range_or_equal_string(
        Math.round((total_GPA(data, cs_data, false) + Number.EPSILON) * 100) /
          100,
        Math.round((total_GPA(data, cs_data, true) + Number.EPSILON) * 100) /
          100,
      ),
    [data],
  );

  return (
    <div className="font-cmu relative flex p-8 pb-0 text-center text-2xl opacity-50">
      <button
        className="text-brownish relative w-8 rotate-90 text-center"
        onClick={() => {}}
      >
        {/* <Image
          priority
          src="/gpa-calculator/arrow.svg"
          alt="Follow us on Twitter"
          fill={true}
        /> */}
      </button>
      <div className="flex-grow">
        {!Number.isNaN(total_GPA(data, cs_data)) ? (
          <> Total GPA {total_gpa_string} </>
        ) : (
          <> GPA: Not enough data. </>
        )}
      </div>
      <div className="w-8"></div>
    </div>
  );
}
