import {useState} from "react"
import  graph  from "./graph.json";
import  nodes  from  "./nodes.json";
import { SynsetRow } from  "./SynsetRow";




export function Synset({synonym}) {

	console.log("synonym: ", synonym());

	var nodeid = 0;
	if (synonym() === undefined) {
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
					<SynsetRow
						row = {displayList}
					/>
				)
			})}
		</ul>
	)
}


function random_node() {

	var r = 0;
	while(true) {
		r = Math.floor(Math.random() * 30260);
		if (r % 3 == 0)
			break;
	}
	return r;
}

function getDisplayListInfo(node) {
	var synset = graph[node];
	var listInfo = []; var row = 0;

	for (var i = 0; i < synset.length; i++) {
		var nodeid = synset[i];
		var elem = {node: nodeid, text: nodes[nodeid][0], color: color_from_cost(nodes[nodeid][1])}
		//var elem = {node: nodeid, text: nodes[nodeid][0], color: "blue" }

		if ((i % 8) == 0) {
			listInfo.push([elem]);
			row++;
		}
		else
			listInfo[row-1].push(elem);
	}
	return listInfo;
}


function color_from_cost(cost) {
	if (cost < 5e4)
		return "blue";
	else if (cost < 3e5)
		return "lightblue";
	else if (cost < 1e6)
		return "aquamarine"
	else if (cost < 5e6)
		return "aqua";
	else if (cost < 1e7)
		return "green"
	else if (cost < 5e7)
		return "greenyellow"
	else if (cost < 1e8)
		return "yellow";
	else if (cost < 5e8)
		return "orange";
	else if (cost < 1e9)
		return "orangered"
	else if (cost < 1.5e10)
		return "red"
	else
		return "gray"
}


function nodeid_from_text(text, info) {
    // This func is O(N), but it is rarely used and the
    // the need for an auxiliary dictionary is avoided.
	for (var nodeid in info) {
		if (info[nodeid][0] == text)
			return nodeid;
	}
	return null;
}
