import {useState} from "react"
import  graph  from "./graph.json";
import  nodes  from  "./nodes.json";
import { SynsetRow } from  "./SynsetRow";

import  { nodeid_from_text, getDisplayListInfo, random_node } from "./core.js";


export function Synset({synonym, onClick}) {

	var nodeid = 0;
	if (synonym() == null) {
		nodeid = random_node();
	}
	else {
		nodeid = nodeid_from_text(synonym(), nodes);
	}

	const displayList = getDisplayListInfo(nodeid);

	return (
		<ul className="quux">
			{displayList.map(function(displayList, index, array) {
				return (
					<SynsetRow onClick = {onClick}
						row = {displayList}
					/>
				)
			})}
		</ul>
	)
}
