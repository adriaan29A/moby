import node_data from "./nodes.json";
import graph  from "./graph.json";
import {CreatePriorityQueue} from "./priorityQueue.js";

// used by nav.js
export {getDisplayInfo, expand_synset, dijkstra, get_cost_and_distance, make_path,
		random_node, minmax, nodeid_from_text, colors, zin,
		zout, MIN_ZOOM, MAX_ZOOM, DEFAULT_ZOOM, TEXT, COST };

// temporary testing purposes
var g_c1 = 1; var g_c2 = 1; var g_limit = 0;

// color stuff
const ztable = [4e9, 5e8, 1e8, 1e7, 1e6, 5e5, 3e5, 20e4, 5e4];
var colors = ["Blue",  "DeepSkyBlue", "BlueViolet", "", "LightGreen", "Lime",
              "Yellow", "LightYellow", "Orange", "Red"];

// zoom stuff
const MIN_ZOOM = 5e4;
const MAX_ZOOM = 4e9;
const DEFAULT_ZOOM = 5e5;

const zin = {}; const zout = {};

for (var i = 0; i < ztable.length - 1; i++) {
    zin[ztable[i]] = ztable[i+1];
    zout[ztable[i+1]] = ztable[i];
}

// tuples/indexes
const ID = 0;
const TEXT = 0;
const COST = 1;


// there are 30,260 root entries
// there are 1,181,180 chars
// there are 103,316/306/360 synonyms depending.

/*--

  Constructs main synset display list ready to convert --> HTML

--*/
function getDisplayInfo(nodes, zlevel, xfactor, curr, extent) {
    const FONT_SIZE_HACK_MAX = 16;
    const FONT_SIZE_HACK_MIN = 8; // BUGBUG CHANGE THIS IN SYNSETROW TOO.
    var node_costs = {};
    var revised_node_costs = {};
	var charcount = 0;

    // A little pre-processing
    for (var node of nodes) {

	if (graph[node].length == 0)
		node_costs[node] = 0;

	    node_costs[node] = node_data[node][COST];

	    charcount += node_data[node][TEXT].length + 1;
    }

    if (nodes.length == 0)
        return false; // bug - different type return

    // compute min and max cost before applying sigmoid
    var [min_cost, max_cost] = minmax(node_costs);

    for (node of nodes)
        if (node_data[node][COST] < zlevel)
            revised_node_costs[node] = Math.floor(node_costs[node]
		* sigmoid(node_costs[node], max_cost));
        else
            // Important so these nodes don't contribute to scaling
            revised_node_costs[node] = 0;

    // post-sigmoid recompute max and min cost
    [min_cost, max_cost] = minmax(revised_node_costs);

    // leaf nodes blanked when (any other nodes are and
    // xfactor is 0), i.e. are in expando mode.
    var suppress_leafs = false;
    for (node of nodes)
        if (graph[node].length != 0)
            if ((node_data[node][COST] > zlevel) & (xfactor == 0)) {
		suppress_leafs = true;
                break;
	    }

    // specifically to put root term in already alphatized list
    nodes = nodes.sort(compareFn2);

    // Now determine the number of columns and rows of
    // characters required based on window dims and char
    // count, along with the font size

    // Find #rows, #cols required to display
    // from #chars and ar (aspect ratio)
    // rows * cols = chars,
    // cols / (1.5 *rows)  = ar
    // ==> rows = chars / cols
    // ==> cols^2 = ar * chars

    var ar = extent.width / extent.height;
    var cols = Math.sqrt(2.25 * charcount * ar); // 2.25 = 1.5^2
    var rows = charcount / cols;
    var font_size = extent.width / cols;
    var nsyns = nodes.length;

    if (font_size >= FONT_SIZE_HACK_MAX)
	font_size = FONT_SIZE_HACK_MAX;
    else if (font_size <= FONT_SIZE_HACK_MIN)
	font_size = FONT_SIZE_HACK_MIN;

    var params = {
	nsyns,
	extent,    // everything below
	charcount, // is derived from these
	ar,
	rows,
	cols,
	font_size
    };

    console.log('params: ' + params);

    // colorize by cost and lay out with ~constant aspect ratio
    return [params, colorize_and_layout(nodes, revised_node_costs,
                         min_cost, max_cost, zlevel, suppress_leafs, curr, params)];
}


// sort function for getDisplayInfo
function compareFn2(a, b) {

	var sa = node_data[a][TEXT];
	var sb = node_data[b][TEXT];

	return (sa < sb) ? -1 : (sa > sb) ? 1 : 0;
}


/*--

  Low-level display processing api called by display_adjacency_list

--*/


//
//
//
function colorize_and_layout(nodes, revised_node_costs,
	min_cost, max_cost, zlevel, suppress_leafs, curr, params) {
	// displayInfo contains the list of list of colorized nodes with list
	// sizes adjusted to maintain an approximate constant aspect ratio
	// [node1, node2, ....] => [ [node1, node2, ...],
	//                           [nodex, nodey, ...],
	//                                          ...]
	var displayInfo = [];

	var ncur = 0;
    var nprev = 0;

	var columns = params.cols;

var n = nodes.length;
    while (ncur < n) {

        // determines the number of nodes that can be printed on
        // one line and the total resulting line length
        var line_length = 0;
        while (true) {

            var node = nodes[ncur];
            var length = node_data[node][TEXT].length + 1; // 1 for 1 ws
            line_length += length;
            if (line_length >= columns - 1) {
                line_length -= length;
                ncur -= 1;
                break;
			}
            if (ncur == (n - 1))
                break;
            ncur += 1;
		}

        // colorize and format one line
        var line = '';
		var displayLine = [];

		for (i = nprev; i < ncur + 1; i++) {

			var color = '';
            if (graph[nodes[i]].length != 0) {
                if (node_data[nodes[i]][COST] < zlevel) {

					if (max_cost == 0) // handle special case
                        var id = 0;
					// scale colors linearly
                    else
                        id = Math.floor((revised_node_costs[nodes[i]] - min_cost) /
                                        (max_cost - min_cost) * (colors.length - 1));
					color = colors[id];
				}
				else
					color = "Black"; // >= zlevel blanks the node
			}
			else {

				if (!suppress_leafs) // show or blank leafs
					color = "Grey";
				else
					color = "Black";
			}

			var text = node_data[nodes[i]][TEXT];

			// visually mark root term with brackets
			if (nodes[i] == curr) {
				text = '[ ' + text + ' ]';
				color = (color == "Black") ? "Red" : color;
			}

			displayLine.push( { nodeid: nodes[i], text: text,
								color: color, cost: node_data[nodes[i]][COST]} );


		} // end for (i = nprev; i < ncur; i++)

        // Done formatting line
		displayInfo.push(displayLine);
        ncur += 1;
		nprev = ncur;

	}  // end while(ncur < n)

	return center_pad(displayInfo, columns);

}

//
// helper functions for print/display_adjacency_list above
//

function sigmoid(freq, max_freq) {

    var c1 = g_c1; var c2 = g_c2 / c1;
    var f = freq / max_freq;
    if (f == 0)
        var y = 1.0 / Infinity;
    else
        y  =  1.0 / (1 + Math.exp(-1.0 * c1 * (f - c2)));
    return y;
}

function minmax(nodes) {
	var values = Object.keys(nodes).map(function(key) {
		return nodes[key]; });
	return [Math.min(...values), Math.max(...values)];
}


// Prepends eache node list with a blank node sized
// to acheive a center-line effect for each row
function center_pad(displayInfo, columns) {

	for (var i in displayInfo) {

		var line = '';
		for (var node of displayInfo[i])
			line += node.text + ' ';

		// Add half of slack on to the beginning of the
		// row in order to give a line-center effect
		var slack = columns - line.length;
		if (slack > 2)
		{
			var half = Math.floor(slack / 2);

			var pad = { nodeid: -1, text: '*'.repeat(half),
						color: "Black", cost: 0 };

			displayInfo[i].unshift(pad);

		}
/* testing
		displayInfo[i].push({ nodeid: -1, text: columns.toString(),
							  color: "Yellow", cost: 0 });
		displayInfo[i].push({ nodeid: -1, text: line.length,
							  color: "Green", cost: 0 });
		displayInfo[i].push({ nodeid: -1, text: slack.toString(),
							  color: "Red", cost: 0 });
*/
	}

	return displayInfo;
}

// sort function for expand_synset below
function compareFn(a, b) {
	var sa = (a[1][0] == '\'') ? a[1].slice(1, a[1].length - 1) : a[1];
	var sb = (b[1][0] == '\'') ? b[1].slice(1, b[1].length - 1) : b[1];
	return (sa < sb)? -1 : (sa > sb) ? 1 : 0;
}

/*

  Takes an existing synset and expands it by walking
  neighbors for additional terms and merging them in.

*/
const EXPANSION_FACTOR = 1.2; // = 1.6; // eyeballed
function expand_synset(synset, level) {

	var synsets = [];
	var final_set = [];
	var expanded_list = [];
	var visited = new Set();

	var limit = synset.length * Math.floor(EXPANSION_FACTOR ** level);

	// populate the final list to be shown with
    // the nodes of the starting synsets.
    // bug - synset already used just above.
	if (synset !== undefined) {
		for (var child of synset ) {
			visited.add(child);
			synsets.push(child);
			final_set.push([child, node_data[child][TEXT]]);
		}
	}
	// breadth first search for nearest terms completing when the requested
	// limit has been reached. BUG - fix infinite loop
	if (limit != 0) {

		var count = 0;
		for (var node of synsets) {
			var children = graph[node];
			for (child of children) {

				if (!visited.has(child) && (child !== undefined)) {
					visited.add(child);
					synsets.push(child);
					final_set.push([child, node_data[child][TEXT]]);
					if (count++ > limit)
						break;
				}
			}
			if (count > limit)
				break;
		}
	}



    final_set = final_set.sort(compareFn);
    expanded_list = final_set.map(([key, value]) => (key));

/*

	final_set = final_set.sort(compareFn);
	for (var item of final_set)
		expanded_list.push(item[0]);
*/
	return expanded_list;
}





/*--

  breadth-first graph walker for finding paths between synonyms

--*/
function dijkstra(G, C, start, goal, edge_weight = 0) {

    var visited = new Set();
	var cost = {}; cost[start] = 0;
	var parent = {}; parent[start] = null;
    var todo = CreatePriorityQueue();
	var empty = false;

    todo.push([0, start]);
	while (true) {
		while(true) {
			if (!todo.isEmpty()) {
				// finds lowest cost vertex
				var vertex = todo.pop()[1];
				// loop until new vertex
				if (!visited.has(vertex)) break;
			}
			else {
				empty = true;
				break;
			}
		}
		// done/ break to outer loop
		if (empty == true)
			break;

		visited.add(vertex);
		if (vertex == goal)
            break;

		for (var neighbor of G[vertex]) {
			if (visited.has(neighbor))
				continue;

            var old_cost = cost[neighbor] ?? Infinity;

			// serious bug I should have caught
			//var cvertex = (C[vertex][COST] != 0) ? C[vertex][COST] : Infinity;
			var cvertex = ((vertex == start) || (C[vertex][COST] != 0)) ? C[vertex][COST] : Infinity;

            var new_cost = cost[vertex] + cvertex + edge_weight;

            if (new_cost < old_cost) {
                todo.push([new_cost, neighbor]);
                cost[neighbor] = new_cost;
                parent[neighbor] = vertex;
			}
		}
	}
	return parent;
}

/*

  graph-walk results helper funcs

*/

function make_path(parent, goal, node_data) {

    if (!(goal in parent))
        return null;

    var v = goal; var path = []; var nodes = [];

    // root has null parent
	while (v != null) {
        path.push(node_data[v][TEXT]);
        nodes.push(v);
        v = parent[v];
	}
    return [path.reverse(), nodes.reverse()];
}

function get_cost_and_distance(parent, goal, node_data) {

	if (!(goal in parent))
        return [Infinity, Infinity];

    var v = goal; var cost = 0; var distance = 0;

    // root has null parent
    while (v != null) {
        v = parent[v];
        if ((v != null) && (parent[v] != null)) {
            cost += node_data[v][COST];
            distance += 1;
		}
	}
    return [cost, distance];
}

//----------------- sundry ----------------

// This func is O(N), but it is rarely used and the
// the need for an auxiliary dictionary is avoided.
function nodeid_from_text(text, node_data) {
	for (var nodeid in node_data) {
		if (node_data[nodeid][TEXT] == text) {
			return parseInt(nodeid, 10);
		}
	}
	return null;
}

// CHANGE ME WHEN YOU CHANGE GRAPH/NODES SIZES
function random_node() {
	var r = 0;
	while(true) {
		r = Math.floor(Math.random() * 30260);
		if (r % 3 == 0)
			break;
	}
    return r;
}

// unloved
function makeStruct(keys) {

	if (!keys) return null;
	const k = keys.split(', ');
	const count = k.length;
	function constructor() {
		for (let i = 0; i < count; i++) this[k[i]] = arguments[i];
	}
	return constructor;
}




//        1         2         3         4         5         6         7         8
//2345678901234567890123456789012345678901234567890123456789012345678901234567890
//


/*

  experimental code to collapse buttons in a list in to one.
  it didn't pan out.

// Gets all the nodes.
function getDisplayInfo2( zlevel, xfactor, curr, extent) {

   var keys = Object.keys(node_data).map(key => {
       return (key) });

    var subkeys = keys.slice(0,5000);

    var  [params, displayList] = getDisplayInfo(subkeys, zlevel, xfactor, curr, extent);

    var buttonizedList = collapseMerge(5, displayList);

    return [params, buttonizedList];
}


// buttonSize is the # enties to collapse into one.
function collapseMerge(buttonSize, displayList) {

    var displayInfo = [];

    for (var li of displayList) {

	var count = 0;
	var adjlist = [];
	var group = [];

	for (var node of li) {

	    group.push({...node});
	    count++;

	    // add nodes until buttonsize reached or last node
	    if (((count % buttonSize) == 0) || (count == li.length)) {
	    	var button = group.reduce(concat);
		adjlist.push({...button})
		group = [];
	    }
	}
	displayInfo.push(adjlist);
    }

    return displayInfo;

}

// used by collapseMerge
function concat(a, b) {
    console.log(gl++);
    return {nodeid: a.nodeid, color: b.color, cost: a.cost, text: a.text + ' ' + b.text};
}

*/



/*
  node is not compatible with the browser so you haveto use the below
  code to read the data if you want to run 'node core.js'

import * as fs from 'fs';

import { readFile } from 'fs/promises';
const node_data = JSON.parse(
    await readFile(
	new URL('./nodes.json', import.meta.url)));

const graph = JSON.parse(
    await readFile(
	new URL('./graph.json', import.meta.url)));

*/


// Doesn't work under node currently but might in the future
//import node_data from "./nodes.json" with { type: "json" };
//import graph  from "./graph.json" with { type: "json" };

// works
// process.stdout.write(JSON.stringify(fullList) + '\n');



/*
example how to fault in rows and columns into the current view.

const ROWS = 16;
const COLS = 20;
const START_I = 0;
const START_J = 0;

const [params, fullList] = getDisplayInfo2(5e9, 0, 0, {width:1920, height:1080});
for (var i = START_I; i < (START_I + ROWS); i++) {

    var linebuf = [];

    for (var j = START_J; j < (START_J + COLS); j++) {
	var text = fullList[i][j].text;
	console.log(i,j, text);
	linebuf[j] = text;
    }

    for (var j = START_J; j < START_J + ROWS; j++) {
	process.stdout.write(JSON.stringify(linebuf[j]) + ' ');
    }
    process.stdout.write('\n\n');
}






*/
