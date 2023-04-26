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



const blue = "#00A"; const lightblue ="#55F"; const cyan = "#0AA"; const lightcyan = "#5FF";
const magenta ="#A0A"; const lightmagenta ="#F5F"; const green="#0A0"; const lightgreen ="#5F5";
const yellow ="#A50"; const lightyellow="#FF8"; const red="#A00"; const lightred="#F55";
const black = "#000"; const lightblack = "#555";

function color_from_cost(cost) {
	if (cost < 5e4)
		return "Blue";
	else if (cost < 3e5)
		return "DeepSkyBlue";
	else if (cost < 5e5)
		return "BlueViolet";
	else if (cost < 1e6)
		return "LightMagenta";
	else if (cost < 5e6)
		return "lightgreen";
	else if (cost < 1e7)
		return "Lime";
	else if (cost < 5e7)
		return "Yellow";
	else if (cost < 1e8)
		return "lightyellow";
	else if (cost < 5e9)
		return "OrangeRed";
	else if (cost < 1.5e10)
		return "Red";
	else
		return Gray;
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
