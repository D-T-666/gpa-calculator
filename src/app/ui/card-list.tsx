"use client";

import { useRef, useState } from "react";
import { CourseDict, UserData } from "../lib/definitions";
import Card from "./card";

import { available_courses } from "../lib/calculations";
import AddCard from "./add-card";

import cs_data_ from "../lib/cs.json";
import clsx from "clsx";
import Image from "next/image";
const cs_data = cs_data_ as CourseDict;

export type CardListProps = {
  semester: number;
  data: UserData;
  dispatch: Function;
};

export default function CardList({ semester, data, dispatch }: CardListProps) {
  let [available, setAvailable] = useState(false);
  const ref = useRef<null | HTMLDivElement>(null);

  let toggleAvailable = () => {
    if (!available) {
      setTimeout(
        () => ref.current!.scrollBy({ behavior: "smooth", top: 300 }),
        300,
      );
    }
    setAvailable(!available);
  };

  return (
    <div className="flex flex-col items-center overflow-scroll" ref={ref}>
      <div className="bg-greyblue relative flex w-full max-w-[28em] snap-y flex-col space-y-8 p-8 pt-0">
        {Object.keys(data.semesters[semester]).map((title, index) => (
          <Card
            data={data}
            sem={semester}
            course={title}
            key={index}
            dispatch={dispatch}
          />
        ))}
        <button
          className="items-centerjust text-bold flex w-full items-center p-8 pr-16 text-3xl"
          onClick={toggleAvailable}
        >
          <div
            className={clsx(
              "text-brownish relative h-8 w-8 min-w-8 text-center transition",
              {
                "-rotate-90": !available,
              },
            )}
          >
            <Image
              priority
              src="/gpa-calculator/arrow.svg"
              alt="Follow us on Twitter"
              fill={true}
            />
          </div>
          <div className="flex-grow">Add</div>
        </button>
        {available &&
          available_courses(data, semester, cs_data).map((course, index) => (
            <AddCard
              {...{ data, dispatch, course }}
              sem={semester}
              key={index}
            />
          ))}
      </div>
    </div>
  );
}
