'use client'

import CardList from "./ui/card-list";
import { SemesterBar } from "./ui/semester-selection";
import { useEffect, useReducer, useState } from "react";
import { CourseDict, DataUpdateAction, UserCourseData, UserSyllabusData, UserData } from "./lib/definitions";
import { course_points } from "./lib/calculations";

import cs_data_ from "./lib/cs.json";
const cs_data = cs_data_ as CourseDict;

import Header from "./ui/header";

function reducer(data: UserData, action: DataUpdateAction): UserData {
  console.log("Reducer fired", action);

  let res = data;
  switch (action.type) {
    case "update continuous points": {
      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [action.semester]: {
            ...data.semesters[action.semester],
            [action.course]: {
              ...data.semesters[action.semester][action.course],
              syllabus: {
                ...data.semesters[action.semester][action.course].syllabus,
                [action.group]: {
                  ...data.semesters[action.semester][action.course].syllabus![action.group],
                  [action.item]: action.points
                }
              },
            }
          }
        }
      } as UserData;
      break;
    }
    case "update total points": {
      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [action.semester]: {
            ...data.semesters[action.semester],
            [action.course]: {
              ...data.semesters[action.semester][action.course],
              total: action.points
            }
          }
        }
      } as UserData;
      break;
    }
    case "convert to total": {
      console.log(data.semesters[action.semester][action.course]);
      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [action.semester]: {
            ...data.semesters[action.semester],
            [action.course]: {
              ...data.semesters[action.semester][action.course],
              mode: "total",
              total: course_points(data.semesters[action.semester][action.course].syllabus!, cs_data[action.course].syllabus!)
            }
          }
        }
      } as UserData
      break;
    }
    case "convert to continuous": {
      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [action.semester]: {
            ...data.semesters[action.semester],
            [action.course]: {
              ...data.semesters[action.semester][action.course],
              mode: "continuous",
              total: course_points(data.semesters[action.semester][action.course].syllabus!, cs_data[action.course].syllabus!)
            }
          }
        }
      } as UserData;
      break;
    }
    case "add semester": {
      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [Object.keys(data.semesters).length]: {}
        }
      }
      break;
    }
    case "delete semester": {
      const last_semester = Object.keys(data.semesters).length - 1;

      let { [last_semester]: _, ...semesters } = data.semesters;

      if (Object.keys(semesters).length === 0) {
        semesters = { "0": {} };
      }

      res = {
        ...data,
        semesters: semesters
      }
      break;
    }
    case "add course": {
      let syllabus = undefined;
      let temp = {
        mode: syllabus !== undefined ? "continuous" : "total"
      } as UserCourseData;

      if (cs_data[action.course].syllabus !== undefined) {
        temp.syllabus = {} as UserSyllabusData;
        for (let [group_name, group_data] of Object.entries(cs_data[action.course].syllabus!)) {
          temp.syllabus[group_name] = {};
          for (let item of Object.keys(group_data.items)) {
            temp.syllabus[group_name][item] = null;
          }
        }
      } else {
        temp.total = 0;
      }

      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [action.semester]: {
            ...data.semesters[action.semester],
            [action.course]: temp
          }
        }
      };

      console.log("Added course.", res);
      break;
    }
    case "delete course": {
      console.log("Deleting course", action.course, "from semester", action.semester);
      let { [action.course]: _, ...sem } = data.semesters[action.semester];
      res = {
        ...data,
        semesters: {
          ...data.semesters,
          [action.semester]: sem
        }
      }
      break;
    }
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem("data", JSON.stringify(res));
  }

  return res;
};

export default function Home() {
  let default_data = {
    version: "0.0.3",
    semesters: { 0: {} }
  } as UserData;
  useEffect(() => {
    dispatch({
      type: "add course",
      semester: 0,
      course: "Introduction to Databases"
    });
  }, []);

  let saved_data = null;
  if (typeof window !== "undefined") {
    saved_data = window.localStorage.getItem("data");
    if (saved_data !== null) {
      saved_data = JSON.parse(saved_data) as UserData;
      if (saved_data.version !== default_data.version) {
        saved_data = null;
      }
    }
  }

  const [data, dispatch] = useReducer(reducer, (saved_data !== null ? saved_data : default_data) );

  const [semester, setSemester] = useState(0);

  return (
    <main className="bg-greyblue h-screen font-serif flex flex-col">
      <Header data={data}/>

      <SemesterBar
        activeSemester={semester}
        data={data}
        dispatch={dispatch}
        setActiveSemester={(s: number) => {
          console.log(s); setSemester(s)
        }}/>

      <CardList {...{data, dispatch, semester}} />
    </main>
  );
}
