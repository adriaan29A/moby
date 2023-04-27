import nodes from "./nodes.json";
import graph  from "./graph.json";


const DEFAULT_COLUMNS = 80;
const AVG_WORDS_PER_80_COL = 9; // eyeballed
function print_adjacency_list(nodes, node_data, graph, revised_node_costs,
							  min_cost, max_cost, zlevel, suppress_leafs, curr) {
    var ncur = 0;
    var nprev = 0;

	// estimate columns to print.
	var columns = (nodes.length < 40) ? DEFAULT_COLUMNS :
		DEFAULT_COLUMNS + Math.floor(nodes.length/AVG_WORDS_PER_80_COL);

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

        // Print one line
        var line = '';
        var nodecount = 0;
		for (i = nprev; i < ncur; i++) {

            if (graph[nodes[i]].length != 0) {

                if (node_data[nodes[i]][COST] < zlevel) {
                    if (max_cost == 0)
                        var id = 0;
                    else
                        id = Math.floor((revised_node_costs[nodes[i]] - min_cost) /
                                        (max_cost - min_cost) * (fmt.length - 1));

					if (nodes[i] == curr) //
						var format = lightred + normal;//
					else //
						format = fmt[id]; // original
				}
				else
					format = black + dim;
			}
			else {

				if (!suppress_leafs)
					format = lightblack + dim;
				else
					format = black + dim;
			}
			var curr_bracket_left = (nodes[i] == curr) ? '<' : ''; //
			var curr_bracket_right = (nodes[i] == curr) ? '>' : ''; //

            s = format + curr_bracket_left + node_data[nodes[i]][TEXT] + curr_bracket_right + ' '; //
            line += s;
            nodecount += 1;
		}

		console.log(center_line(line, nodecount, columns));
		//console.log(line);
        // print(black, end=''); ????

        // Done printing line
        ncur += 1;
		nprev = ncur;

	}  // end while(ncur < n)

	console.log(reset);
}


/*--

  Constructs final syntax display list

  --*/
function display_adjacency_list(raw_nodes, node_data, graph, zlevel, xfactor, curr) {

    var nodes = [];
    var node_costs = {};
    var revised_node_costs = {};

    for (var node of raw_nodes) {
		if ((node_data[node] !== 'undefined') && (node_data[node][COST] != Infinity)) {
			nodes.push(node);
			node_costs[node] = node_data[node][COST];
		}
	}
    if (nodes.length == 0)
        return false;

    for (node of nodes)
        if (graph[node].length == 0)
            node_costs[node] = 0;

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

    // leaf nodes blanked when any other nodes are.
    var suppress_leafs = false;
    for (node of nodes)
        if (graph[node].length != 0)
            if (node_data[node][COST] > zlevel) {
                suppress_leafs = true;
                break;
			}

	//console.clear();
    console.log('\n');

    print_adjacency_list(nodes, node_data, graph, revised_node_costs,
                         min_cost, max_cost, zlevel, suppress_leafs, curr);

	console.log('\nzoom:\t' + zlevel.toExponential(1));
	console.log('#syns:\t', nodes.length);

	// if (xfactor != 0)
		// console.log('expand:\t', xfactor);

    console.log('curr:\t' + node_data[curr][TEXT] + ' (' + curr + ')');


    return true;
}

// helper functions for print/display_adjacency_list above

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

function center_line(line, nodecount, columns) {
    var slack = columns - (line.length - (nodecount + nodecount * (black.length + dim.length)));
    var half = Math.floor(slack / 2);
    if (half < 2)
        return line;
    else
        var centered_line = ' '.repeat(half) + line + ' '.repeat(half);
    return centered_line;
}


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
			var cvertex = (C[vertex][COST] != 0) ? C[vertex][COST] : Infinity;
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


// Ancillary functions using dijkstra
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


const EXPANSION_FACTOR = 2; // = 1.6; // eyeballed
function expand_synset(synset, graph, node_data, level) {

	var synsets = [];
	var final_set = [];
	var expanded_list = [];
	var visited = new Set();

	// includes temp hack
	var limit = (g_limit == 0) ? synset.length * (Math.floor(EXPANSION_FACTOR ** level)) : g_limit;

	// populate the final list to be shown with
	// the nodes of the starting synsets.
	if (synset !== undefined) {
		for (var child of synset ) {
			visited.add(child);
			synsets.push(child);
			final_set.push([child, node_data[child][TEXT]]);
		}
	}
	// breadth first search for nearest terms
	// completing when the requested limit has
	// been reached. BUG - infinit loop possible
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
	for (var item of final_set)
		expanded_list.push(item[0]);

	return expanded_list;
}


// sort function for expand_synset
function compareFn(a, b) {
	var sa = (a[1][0] == '\'') ? a[1].slice(1, a[1].length - 1) : a[1];
	var sb = (b[1][0] == '\'') ? b[1].slice(1, b[1].length - 1) : b[1];
	return (sa < sb)? -1 : (sa > sb) ? 1 : 0;
}

//--------------------------------------------------------------------------
// Working functions
//


// CHANGE ME WHEN YOU CHANGE GRAPH/NODES SIZES
export function random_node() {
	var r = 0;
	while(true) {
		r = Math.floor(Math.random() * 30260);
		if (r % 3 == 0)
			break;
	}
	return r;
}

/*
const NUM_ROOT_WORDS = 30260;
function find_random_node(mincost, node_data) {
    while(true) {
        var nodeid = Math.floor(Math.random() * NUM_ROOT_WORDS);
        var cost = node_data[nodeid][COST];
        if (cost != Infinity && cost > mincost)
            return nodeid;
	}
}
*/

export function nodeid_from_text(text, nodes) {
    // This func is O(N), but it is rarely used and the
    // the need for an auxiliary dictionary is avoided.
	for (var nodeid in nodes) {
		if (nodes[nodeid][0] == text)
			return nodeid;
	}
	return null;
}

export function getDisplayListInfo(node) {
	var synset = graph[node];
	var listInfo = []; var row = 0;

	for (var i = 0; i < synset.length; i++) {
		var nodeid = synset[i];

		var elem = {nodeid: nodeid, text: nodes[nodeid][0],
					color: color_from_cost(nodes[nodeid][1]) };

		if ((i % 8) == 0) {
			listInfo.push([elem]);
			row++;
		}
		else
			listInfo[row-1].push(elem);
	}
	return listInfo;
}


/*
navy, blue, fuchsia, gray, green, lime, maroon, olive, purple, red, silver, teal, white, yellow
aqua black blue fuchsia gray green lime maroon navy olive purple red
silver teal white yellow
*/

// ansi/console codes mapped from orig defines using ansi2html node package
const blue = "#00A"; const lightblue ="#55F"; const cyan = "#0AA"; const lightcyan = "#5FF";
const magenta ="#A0A"; const lightmagenta ="#F5F"; const green="#0A0"; const lightgreen ="#5F5";
const yellow ="#A50"; const lightyellow="#FF8"; const red="#A00"; const lightred="#F55";
const black = "#000"; const lightblack = "#555";


// make this binary search
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
		return "LightGreen";
	else if (cost < 1e7)
		return "Lime";
	else if (cost < 5e7)
		return "Yellow";
	else if (cost < 1e8)
		return "lightyellow";
	else if (cost < 2e8)
		return "Orange";
	else if (cost < 1.5e10)
		return "Red";
	else
		return Gray;
}

// unused
function makeStruct(keys) {

	if (!keys) return null;
	const k = keys.split(', ');
	const count = k.length;
	function constructor() {
		for (let i = 0; i < count; i++) this[k[i]] = arguments[i];
	}
	return constructor;
}


/*
navy, blue, fuchsia, gray, green, lime, maroon, olive, purple, red, silver, teal, white, yellow
aqua black blue fuchsia gray green lime maroon navy olive purple red
silver teal white yellow

// ansi/console codes mapped from orig defines using ansi2html node package
const blue = "#00A"; const lightblue ="#55F"; const cyan = "#0AA"; const lightcyan = "#5FF";
const magenta ="#A0A"; const lightmagenta ="#F5F"; const green="#0A0"; const lightgreen ="#5F5";
const yellow ="#A50"; const lightyellow="#FF8"; const red="#A00"; const lightred="#F55";
const black = "#000"; const lightblack = "#555";


// make this binary search
export function color_from_cost(cost) {
	if (cost < 5e4)
		return "Blue";
	else if (cost < 3e5)
		return "DeepSkyBlue";
	else if (cost < 5e5)
		return "BlueViolet";
	else if (cost < 1e6)
		return "LightMagenta";
	else if (cost < 5e6)
		return "LightGreen";
	else if (cost < 1e7)
		return "Lime";
	else if (cost < 5e7)
		return "Yellow";
	else if (cost < 1e8)
		return "lightyellow";
	else if (cost < 2e8)
		return "Orange";
	else if (cost < 1.5e10)
		return "Red";
	else
		return Gray;
}
*/
