import graph from "./graph.json"
import nodes from "./nodes.json"

export function DisplayLine() {


	return (

		<div className = "quux">
		{nodes[0].length === 0 && "No words"}

		{graph[42].map(node => {
			return ( <a href="javascript:void(0);" onclick="myFunction();" >  { nodes[node][0] } </a> ) } ) }
	 	</div>
	)


/*
	return (

		<div className = "quux">
		{words.length === 0 && "No words"}

		{words.map(word => {
			return ( <a href="javascript:void(0);" onclick="myFunction();" style = {{"color": word[1]}} >  {word[0]} </a> ) } ) }
	 	</div>
	)
*/

}


//	return ( <a href="javascript:void(0);" onclick="myFunction();" style = {{"color": "blue"}} >  {{"moon"}} </a> ) } ) }
//			return ( <a href="foo"> {word[0]} </a> ) } ) }
