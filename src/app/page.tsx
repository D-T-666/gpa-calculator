'use client'

import Image from "next/image";
import Card from "./ui/card";
import CardList from "./ui/card-list";
import SemesterSelection from "./ui/semester-selection";
import { ReducerAction, useReducer, useState } from "react";
import { DataUpdateAction, Semester, Semesters } from "./lib/definitions";
import { calculatePoints } from "./lib/calculations";

import cs_data from "./lib/cs.json";
import Header from "./ui/header";

export default function Home() {
  const reducer = (state: Semesters, action: DataUpdateAction): Semesters => {
    console.log("Reducer fired", action);

    let res;
    switch (action.type) {
      case "update continuous points": {
        if (state[action.semester][action.course].mode === "continuous") {
          let temp = {
            ...state,
            [action.semester]: {
              ...state[action.semester],
              [action.course]: {
                ...state[action.semester][action.course],
                curriculum: {
                  ...state[action.semester][action.course].curriculum,
                  [action.group]: {
                    ...state[action.semester][action.course].curriculum![action.group],
                    items: {
                      ...state[action.semester][action.course].curriculum![action.group].items,
                      [action.item]: {
                        ...state[action.semester][action.course].curriculum![action.group].items[action.item],
                        points: action.points
                      }
                    }
                  }
                },
              }
            }
          } as Semesters;
          res = {
            ...temp,
            [action.semester]: {
              ...temp[action.semester],
              [action.course]: {
                ...temp[action.semester][action.course],
                total: calculatePoints(temp[action.semester][action.course].curriculum!)
              }
            }
          } as Semesters;
        } else {
          res = state;
        }
        break;
      }
      case "update total points": {
        res = {
          ...state,
          [action.semester]: {
            ...state[action.semester],
            [action.course]: {
              ...state[action.semester][action.course],
              total: action.points
            }
          }
        } as Semesters
        break;
      }
      case "convert to total": {
        res = {
          ...state,
          [action.semester]: {
            ...state[action.semester],
            [action.course]: {
              ...state[action.semester][action.course],
              mode: "total",
              total: calculatePoints(state[action.semester][action.course].curriculum!)
            }
          }
        } as Semesters
        break;
      }
      case "convert to continuous": {
        res = {
          ...state,
          [action.semester]: {
            ...state[action.semester],
            [action.course]: {
              ...state[action.semester][action.course],
              mode: "continuous",
              total: calculatePoints(state[action.semester][action.course].curriculum!)
            }
          }
        } as Semesters
        break;
      }
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("data", JSON.stringify(res));
    }
    return res;
  };

  let saved_data = null;
  if (typeof window !== "undefined") {
    saved_data = window.localStorage.getItem("data");
  }

  const [data, dispatch] = useReducer(reducer, (saved_data !== null ? JSON.parse(saved_data) : cs_data) as Semesters);

  console.log(data);

  const [semester, setSemester] = useState(0);

  return (
    <main className="bg-greyblue h-screen font-serif flex flex-col">
      <Header data={data}/>
      
      <SemesterSelection 
        semesters={3} 
        semester={semester} 
        data={data} 
        setSemester={(s: number) => {
          console.log(s); setSemester(s)
        }}/>

      <CardList>
        {Object.keys(data[semester]).map((title, index) => 
          <Card 
            data={data} 
            sem={semester} 
            course={title} 
            key={index} 
            dispatch={dispatch}/>
        )}
      </CardList>
    </main>
  );
}
