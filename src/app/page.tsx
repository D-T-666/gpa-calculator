'use client'

import Image from "next/image";
import Card from "./ui/card";
import CardList from "./ui/card-list";
import { SemesterBar } from "./ui/semester-selection";
import { ReducerAction, useReducer, useState } from "react";
import { CourseDict, DataUpdateAction, UserCourseData, UserCurriculumData, UserData } from "./lib/definitions";
import { course_points } from "./lib/calculations";

import cs_data_ from "./lib/cs.json";
const cs_data = cs_data_ as CourseDict;

import Header from "./ui/header";

export default function Home() {
  const reducer = (data: UserData, action: DataUpdateAction): UserData => {
    console.log("Reducer fired", action);

    let res = data;
    switch (action.type) {
      case "update continuous points": {
        console.log(typeof data.semesters[action.semester][action.course]);
        // if (data[action.semester][action.course])
        // if (data[action.semester][action.course].mode === "continuous") {
        //   let temp = {
        //     ...data,
        //     [action.semester]: {
        //       ...data[action.semester],
        //       [action.course]: {
        //         ...data[action.semester][action.course],
        //         curriculum: {
        //           ...data[action.semester][action.course].curriculum,
        //           [action.group]: {
        //             ...data[action.semester][action.course].curriculum![action.group],
        //             items: {
        //               ...data[action.semester][action.course].curriculum![action.group].items,
        //               [action.item]: {
        //                 ...data[action.semester][action.course].curriculum![action.group].items[action.item],
        //                 points: action.points
        //               }
        //             }
        //           }
        //         },
        //       }
        //     }
        //   } as Semesters;
        //   res = {
        //     ...temp,
        //     [action.semester]: {
        //       ...temp[action.semester],
        //       [action.course]: {
        //         ...temp[action.semester][action.course],
        //         total: course_points(temp[action.semester][action.course].curriculum!)
        //       }
        //     }
        //   } as Semesters;
        // } else {
        //   res = data;
        // }
        break;
      }
      case "update total points": {
        // res = {
        //   ...data,
        //   [action.semester]: {
        //     ...data[action.semester],
        //     [action.course]: {
        //       ...data[action.semester][action.course],
        //       total: action.points
        //     }
        //   }
        // } as Semesters
        break;
      }
      case "convert to total": {
        // res = {
        //   ...data,
        //   [action.semester]: {
        //     ...data[action.semester],
        //     [action.course]: {
        //       ...data[action.semester][action.course],
        //       mode: "total",
        //       total: course_points(data[action.semester][action.course].curriculum!)
        //     }
        //   }
        // } as Semesters
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
                total: course_points(data.semesters[action.semester][action.course].curriculum!, cs_data[action.course].curriculum!)
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
      case "add course": {
        let curriculum = undefined;
        let temp = {
          mode: curriculum !== undefined ? "continuous" : "total"
        } as UserCourseData;

        if (cs_data[action.course].curriculum !== undefined) {
          temp.curriculum = {} as UserCurriculumData;
          for (let [group_name, group_data] of Object.entries(cs_data[action.course].curriculum!)) {
            temp.curriculum[group_name] = {};
            for (let item of Object.keys(group_data.items)) {
              temp.curriculum[group_name][item] = null;
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

        console.log(res);
        break;
      }
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("data", JSON.stringify(res));
    }
    return res;
  };

  let default_data = {
    version: "0.0.1",
    semesters: {
      0: {
        "Discrete Structures": {
          mode: "total",
          total: 92
        }
      }
    }
  } as UserData;
  
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

  console.log(data);

  const [semester, setSemester] = useState(0);

  return (
    <main className="bg-greyblue h-screen font-serif flex flex-col">
      <Header data={data}/>
      
      <SemesterBar
        semesters={Object.keys(data.semesters).length} 
        semester={semester} 
        data={data} 
        dispatch={dispatch}
        setSemester={(s: number) => {
          console.log(s); setSemester(s)
        }}/>

      <CardList {...{data, dispatch, semester}} />
    </main>
  );
}
