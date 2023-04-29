import {useState} from "react"
import  graph  from "./graph.json";
import  nodes  from  "./nodes.json";
import { SynsetRow } from  "./SynsetRow";

import  { nodeid_from_text, getDisplayListInfo, random_node } from "./core.js";


export function Synset({nav, onClick}) {

	function handleOnClick(e) {
		console.log(e.target.innerText);

		//var foo = nodeid_from_text(e.target.innerText);
		var foo = e.target.id;
		nav.current = foo;
		console.log('nav.current: ', foo);
		onClick(nav.get());
	}

	const displayList = nav.getDisplayListInfo();

	return (
		<ul className="quux">
			{displayList.map(function(displayList, index, array) {
				return (
					<SynsetRow onClick = {handleOnClick}
						row = {displayList}
					/>
				)
			})}
		</ul>
	)
}
