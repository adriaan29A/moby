import { SynsetRow } from "./SynsetRow"


export function Synset() {

	//const displist = getDispListInfo(node, graph, nodeinfo, zlevel);

	const dispList =
		  [
			  [{nodeid: 2347, text: "diamond", color: "blue", cost: 2349955},
			   {nodeid: 2342, text: "blackbeard", color: "red", cost: 45298655},
  			   {nodeid: 1297, text: "hocuspocus", color: "green", cost: 98655}],

			  [{nodeid: 1012, text: "narwhal", color: "teal", cost: 2349955},
			   {nodeid:  998, text: "jabberwocky", color: "aqua", cost: 45298655},
  			   {nodeid: 1047, text: "californicate", color: "orange", cost: 98655}]
		  ];

	return (
		<ul className="quux">
			{dispList.map(function(dispRow, index, array) {
				return (
					<SynsetRow
						row = {dispRow}
					/>
				)
			})}
		</ul>
	)
}
