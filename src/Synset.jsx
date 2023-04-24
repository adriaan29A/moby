import  graph  from "./graph.json";
import  nodes  from  "./nodes.json";
import { SynsetRow } from  "./SynsetRow";

function random_node() {

	var r = 0;
	while(true) {
		r = Math.floor(Math.random() * 30260);
		if (r % 3 == 0)
			break;
	}
	return r;
}

function getDispListInfo(node) {
	var synset = graph[node];
	var listInfo = []; var row = 0;

	for (var i = 0; i < synset.length; i++) {
		var nodeid = synset[i];
		var elem = {node: nodeid, text: nodes[nodeid][0], color: "blue" }

		if ((i % 8) == 0) {
			listInfo.push([elem]);
			row++;
		}
		else
			listInfo[row-1].push(elem);
	}
	return listInfo;
}

export function Synset() {


	const dispList = getDispListInfo(random_node());

/*
	const dispList =
		  [
			  [{nodeid: 2347, text: "diamond", color: "blue", cost: 2349955},
			   {nodeid: 2342, text: "blackbeard", color: "red", cost: 45298655},
  			   {nodeid: 1297, text: "hocuspocus", color: "green", cost: 98655}],

			  [{nodeid: 1012, text: "narwhal", color: "teal", cost: 2349955},
			   {nodeid:  998, text: "jabberwocky", color: "aqua", cost: 45298655},
  			   {nodeid: 1047, text: "californicate", color: "orange", cost: 98655}]
		  ];

*/

	return (
		<ul className="quux">
			{dispList.map(function(dispList, index, array) {
				return (
					<SynsetRow
						row = {dispList}
					/>
				)
			})}
		</ul>
	)
}
