"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { semester_GPA, in_range_or_equal_string } from "../lib/calculations";
import { CourseDict, UserData } from "../lib/definitions";

import cs_data_ from "../lib/cs.json";
import { useLongPress } from "@uidotdev/usehooks";
const cs_data = cs_data_ as CourseDict;

type SemesterTabProps = {
  data: UserData;
  dispatch: Function;
  index: number;
  activeSemester: number;
  setActiveSemester: Function;
};

function SemesterTab({
  data,
  index,
  activeSemester,
  setActiveSemester,
}: SemesterTabProps) {
  const ref = useRef<null | HTMLDivElement>(null);

  const handleClick = () => {
    setActiveSemester(index);
    console.log(index);
  };

  useEffect(() => {
    if (index === activeSemester) {
      ref.current!.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [activeSemester, index]);

  const points_range_string = useMemo(() => {
    return (
      in_range_or_equal_string(
        Math.round(
          (semester_GPA(data.semesters[index], cs_data, false) +
            Number.EPSILON) *
            100,
        ) / 100,
        Math.round(
          (semester_GPA(data.semesters[index], cs_data, true) +
            Number.EPSILON) *
            100,
        ) / 100,
      ) || 0
    );
  }, [data, index]);

  return (
    <div
      className="flex h-32 min-w-60 select-none snap-center flex-col items-center justify-center py-8"
      ref={ref}
    >
      <button
        className={clsx("flex-column font-cmu w-full align-middle", {
          "opacity-50": activeSemester !== index,
        })}
        onClick={handleClick}
      >
        <div
          className={clsx("relative text-4xl", {
            "text-center underline": activeSemester === index,
          })}
        >
          Semester {index + 1}
        </div>

        <div className="text-center text-2xl opacity-50">
          {!Number.isNaN(
            semester_GPA(data.semesters[index], cs_data, false),
          ) ? (
            <> GPA {points_range_string} </>
          ) : (
            <> GPA: No data. </>
          )}
        </div>
      </button>
    </div>
  );
}

//

export type AddSemesterButtonProps = {
  data: UserData;
  dispatch: Function;
  activeSemester: number;
};

export function AddSemesterButton({
  data,
  dispatch,
  activeSemester,
}: AddSemesterButtonProps) {
  let handleClick = () => {
    dispatch({
      type: "add semester",
    });
  };

  return (
    <button
      className="text-whiteish relative px-4 text-3xl opacity-50"
      onClick={handleClick}
    >
      Add
    </button>
  );
}

export function RemoveSemesterButton({
  data,
  dispatch,
  activeSemester,
  setActiveSemester,
}: {
  data: UserData;
  dispatch: Function;
  activeSemester: number;
  setActiveSemester: Function;
}) {
  let handleClick = () => {
    if (
      Object.keys(data.semesters).length > 1 &&
      activeSemester === Object.keys(data.semesters).length - 1
    ) {
      setActiveSemester(activeSemester - 1);
    }
    dispatch({
      type: "delete semester",
    });
  };

  return (
    <button
      className="text-redish relative w-max min-w-fit px-4 text-3xl opacity-50"
      onClick={handleClick}
    >
      Delete last
    </button>
  );
}

// The bar itself

export type SemesterBarProps = {
  activeSemester: number;
  setActiveSemester: Function;
  data: UserData;
  dispatch: Function;
};

export function SemesterBar({
  data,
  activeSemester,
  setActiveSemester,
  dispatch,
}: SemesterBarProps) {
  return (
    <div className="bg-greyblue no-scrollbar relative flex-shrink-0 snap-x snap-proximity snap-always overflow-x-scroll px-8">
      <div className="relative flex">
        <div className="relative min-w-full snap-none"></div>
        {Object.keys(data.semesters).map((_, index) => (
          <SemesterTab
            {...{ data, dispatch, index, activeSemester, setActiveSemester }}
            key={index}
          />
        ))}
        <AddSemesterButton {...{ data, dispatch, activeSemester }} />
        <RemoveSemesterButton
          {...{ data, dispatch, activeSemester, setActiveSemester }}
        />
        <div className="relative min-w-full snap-none"></div>
      </div>
    </div>
  );
}
