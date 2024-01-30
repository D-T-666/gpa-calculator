'use client';

import { CourseDict, UserData } from "../lib/definitions";
import TypeSwitch from "./type-switch";
import GradeGroup from "./grade-group";
import TotalPoints from "./total-points";

import cs_data_ from "../lib/cs.json";
import { useState } from "react";
import clsx from "clsx";
const cs_data = cs_data_ as CourseDict;

function CardOptions({ toggled, delete_handler }: { toggled: boolean, delete_handler : Function }) {
	return (
		<div className={clsx("relative transition-all w-full flex justify-around text-whiteish mb-0", {
			"max-h-12 h-12 opacity-100": toggled,
			"max-h-0 h-0 opacity-0": !toggled,
		})}>
			<button className="text-2xl font-bold rounded-xl h-fit px-4 py-2 bg-redish" onClick={() => delete_handler()}>
				Delete
			</button>
		</div>
	)
}

export default function Card({ data, sem, course, dispatch }: { course: string; data: UserData, sem: number, dispatch: Function }) {
	let [settings, setSettings] = useState(false);

	const delete_handler = () => {
		dispatch({
			type: "delete course",
			semester: sem,
			course: course
		});
	};

	return (
		<div className="bg-whiteish rounded-3xl w-full shadow-[0_1rem_2rem_0_rgba(0,0,0,0.2)] text-black p-8 pb-0 font-cmu snap-start">
			<div className="flex">
				<h1 className="mb-2 text-2xl flex-grow">
					{course}
				</h1>
				<button
					className="w-6 h-10 min-w-6 min-h-10 -rotate-90 text-4xl float-right align-middle text-brownish"
					onClick={() => setSettings(!settings)}>
					...
				</button>
			</div>

			<CardOptions toggled={settings} delete_handler={delete_handler}/>

			{ // If there's no data for continuous assessment, then there shouldn't be a switch.
			cs_data[course].syllabus !== undefined && <TypeSwitch {...{data, sem, course, dispatch}} />
			}

			{ data.semesters[sem][course].mode === "continuous"
				?   <div className="pb-4">
						{ Object.keys(data.semesters[sem][course].syllabus!).map((group, i) =>
							<GradeGroup {...{data, sem, course, group, dispatch}} key={i}/>
						) }
					</div>
				:   <TotalPoints {...{data, sem, course, dispatch}} /> }
		</div>
	);
}
