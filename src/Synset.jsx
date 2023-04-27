import {useState} from "react"
import  graph  from "./graph.json";
import  nodes  from  "./nodes.json";
import { SynsetRow } from  "./SynsetRow";
import  { random_node, nodeid_from_text, getDisplayListInfo } from "./corelogic"

export function Synset({synonym, onClick}) {

	console.log("synonym: ", synonym());

	var nodeid = 0;
	if (synonym() == null) {
		nodeid = random_node();
	}
	else {
		nodeid = nodeid_from_text(synonym(), nodes);
		console.log('nodeid: ', nodeid);
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
