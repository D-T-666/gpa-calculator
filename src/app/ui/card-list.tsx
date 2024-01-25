'use client';

import { useState } from "react";
import { CourseDict, UserData } from "../lib/definitions";
import Card from "./card";

import { available_courses } from "../lib/calculations";
import AddCard from "./add-card";

import cs_data_ from "../lib/cs.json";
const cs_data = cs_data_ as CourseDict;

export type CardListProps = {
  semester: number;
  data: UserData;
  dispatch: Function;
};



export default function CardList({ semester, data, dispatch }: CardListProps) {
  let [available, setAvailable] = useState(false);

  let toggleAvailable = () => setAvailable(!available);

  return (
    <div className="relative bg-greyblue p-8 pt-0 flex flex-col items-center space-y-8 overflow-scroll">
      {Object.keys(data.semesters[semester]).map((title, index) => 
        <Card 
          data={data} 
          sem={semester} 
          course={title} 
          key={index} 
          dispatch={dispatch}/>
      )}
      <button 
        className="p-16 text-3xl text-bold"
        onClick={toggleAvailable}>
        Add
      </button>
      {
        available && available_courses(data, semester, cs_data).map((course, index) => (
          <AddCard {...{data, dispatch, course}} sem={semester}/>
        ))
      }
    </div>
  );
}
