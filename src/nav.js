import graph from "./graph.json";
import node_data from "./nodes.json";

import  { getDisplayInfo, expand_synset, dijkstra, get_cost_and_distance,
		  random_node, minmax, nodeid_from_text, getDisplayListInfo, colors,
		  zin, zout, color_from_cost, MIN_ZOOM, MAX_ZOOM, DEFAULT_ZOOM, TEXT, COST} from "./core.js";

export function CreateNavigator () {
	return new Navigator();
}


class Navigator {

	constructor() {

        // general navigation
        this.current = null; this.origin = null; this.history = [];

        // game specific
        this.target = null; this.cost = 0; this.last_delta = 0;

        // zoom levels
        this.zlevel = 1e6; this.xfactor = 0; this.session = false;
	}


	set(ctx) {
		this.current = ctx.curr; this.origin = ctx.origin; this.history = ctx.history;
		this.target = ctx.target; this.cost = ctx.cost; this.last_delta = ctx.delta;
		this.zlevel = ctx.zlevel; this.xfactor = ctx.xfactor; this.session = ctx.session;
	}

	get() {
		return { curr: this.current, origin: this.origin, history: this.history,
				 target: this.target, cost: this.cost, delta: this.last_delta,
				 zlevel: this.zlevel, xfactor: this.xfactor, session: this.session};
	}


	getDisplayInfo() {

		if ( this.xfactor == 0) {
			return getDisplayInfo(graph[this.current], this.zlevel,
								  this.xfactor, this.current);
		}
		else {
			var expanded_synset = expand_synset(graph[this.current], this.xfactor);
			return getDisplayInfo(expanded_synset, this.zlevel,
								  this.xfactor, this.current);
		}
	}

/*
    list() {

		this.display();

		if (this.target != null) {
			var color = (this.last_delta <= 0 || this.current == this.origin) ? green : red;
			console.log('goal:\t', node_data[this.target][TEXT]);
			console.log('cost:\t' + color + this.cost.toLocaleString('en-US') + reset);
		}
	}

*/

	zoom(z) {

        if (z == true && this.zlevel > MIN_ZOOM)
            this.zlevel = zin[this.zlevel];
        else if (z == false && this.zlevel < MAX_ZOOM)
			this.zlevel = zout[this.zlevel];

//		this.display();

/*

        if (this.target != null) {
			var color = (this.last_delta <= 0 || this.current == this.origin) ? green : red;
            console.log('goal:\t', node_data[this.target][TEXT]);
			console.log('cost:\t' + color + this.cost.toLocaleString('en-US') + reset);
		}
*/
	}


	// zlevel (filtering) and xfactor (synset expansion) can be modified
	// independently but this function chains them to give an intgrated
	// zoom effect. zlevel = MAX_ZOOM and xfactor = 0 are used to transition
	// betwen the two regimes.

	xoom(x) {

		if (x == false) {
			if (this.xfactor != 0) {
				this.xfactor--;
			}
		}
		else
			this.xfactor++;
	}


	integrated_zoom(z) {

		// zoom out
		if (z == false) {
			if (this.xfactor == 0) { // are in filter mode
				if (this.zlevel == MAX_ZOOM) { // already at max filter level
					this.xfactor++; // expand synset
				}
				else {
					this.zoom(false); // are in expansion mode. down-filter synset
					return;
				}
			}
			else { // xfactor not 0 -> in expansion mode
				this.xfactor++;  // expand synset
			}
		}
		// zoom in, (z = true)
		else {
			if (this.xfactor == 0) { // in filter mode
				this.zoom(true); // up filter synset
				return;
			}
			else {
				this.xfactor--; // unexpand synset
			}
		}
/*
		if (this.target != null) {
			var color = (this.last_delta <= 0 || this.current == this.origin) ? green : red;
			console.log('goal:\t', node_data[this.target][TEXT]);
			console.log('cost:\t' + color + this.cost.toLocaleString('en-US') + reset);
		}
*/
	}

	set_current(object) {

		var nodeid = (typeof(object) == 'string') ?
			this.nodeid_from_text(object, node_data) : object;

		if (nodeid == null || graph[nodeid].length == 0)
            return false;

        this.current = nodeid;
        this.history.push(this.current);
        return true;
	}


	set_target(object) {

		var nodeid = (typeof(object) == 'string') ?
			this.nodeid_from_text(object, node_data) : object;

        if (nodeid == null || graph[nodeid].length == 0)
            return false;

        this.origin = this.current;
        this.target = nodeid;
        this.history = [this.current];

		this.display();

        console.log('goal:\t', node_data[this.target][TEXT]);

        var parent = dijkstra(graph, node_data, this.current, this.target);
        var [cost, jumps] = get_cost_and_distance(parent, this.target, node_data);
        console.log('\nmin cost:\t' + cost.toLocaleString('en-US') + ' / ' + jumps.toLocaleString('en-US'));

        this.cost = cost; // current cost to target
        parent = dijkstra(graph, node_data, this.current, this.target, 1e8);
        [cost, jumps] = get_cost_and_distance(parent, this.target, node_data);
        console.log('min jumps:\t' + cost.toLocaleString('en-US') + ' / ' + jumps.toLocaleString('en-US'));

        return true;
	}

    next() {

        if (this.target == null) {
            console.log('No target selected');
            return false;
		}
        else if (this.current == this.target)
            return false;

        // find min cost path from current node
        var parent = dijkstra(graph, node_data, this.current, this.target);
        var [path, nodes] = make_path(parent, this.target, node_data);

        if (nodes.length > 1) {

            // get next node in path, calculate new cost and delta
            var next_node = nodes[1]; var new_cost;
            if (next_node != this.target) {
                var [cost, jumps] = get_cost_and_distance(parent, this.target, node_data);
                new_cost = cost - node_data[next_node][COST];
			}
			else
				new_cost = 0;

			this.last_delta = (next_node != this.target)? new_cost - this.cost : 0;

            this.current = next_node;
            this.history.push(next_node);
            this.cost = new_cost;

			this.display();

			var color = (this.last_delta <= 0)? green : red;
            console.log('target:\t', node_data[this.target][TEXT]);
			console.log('cost:\t' + color  + this.cost.toLocaleString() + reset); // dropped another endl
		}
		return true;
	}

	back() {

        var node = this.history.pop();
        if (this.history.length == 0) {
            this.history.push(node);
            return true;
		}

		this.current = this.history.slice(-1);
		this.display();

        if (this.target != null) {

            // find min cost path from current node
            var parent = dijkstra(graph, node_data,
								  this.current, this.target);

            var [cost, jumps] = get_cost_and_distance(parent, this.target,
													  node_data);
            this.last_delta = cost - this.cost;
            this.cost = cost;

			var color = (this.last_delta <= 0 || this.current == this.origin) ? green : red;
            console.log('goal:\t', node_data[this.target][TEXT]);
            console.log('cost:\t' + color  + this.cost.toLocaleString() + reset); // dropped another endl
		}

		return true;
	}


    // jump to a given word, possibly in a navigation session
	goto(object) {

		var next_node = (typeof(object) == 'string') ?
			this.nodeid_from_text(object, node_data) : object;

        if (next_node == null || graph[next_node].length == 0)
            return false;

		this.current = next_node;
		this.display(graph[this.current]);

        // if tracking to a target
        if (this.target != null) {

            // find min cost path from current node
            var parent = dijkstra(graph, node_data, next_node, this.target);
            var [new_cost, jumps] = get_cost_and_distance(parent, this.target, node_data);

            this.last_delta = new_cost - this.cost;
            this.cost = new_cost;

			var color = (this.last_delta <= 0 || this.current == this.origin) ? green : red;
            console.log('goal:\t', node_data[this.target][TEXT]);
            console.log('cost:\t' + color  + this.cost.toLocaleString() + reset); // dropped another endl
		}

        this.history.push(this.current);

        return true;
	}

    print_history() {
        var path = '';
        if (this.history.length == 0)
            this.history.push(this.current);
        for (var nodeid of this.history)
            path += node_data[nodeid][TEXT] + ' ';
        console.log(path);
	}

    print_color_scale() {

        var color_scale = '';

        // Get max cost in current view
        var node_costs = {};
        var adj_list = graph[this.current];
        for (var nodeid of adj_list)
            if (node_data[nodeid][COST] < this.zlevel)
                node_costs[nodeid] = node_data[nodeid][COST];

        var [min_cost, max_cost] = minmax(node_costs);
        for (i = 0; i < colors.length; i++) {
            var color = colors[i];
            var flat_level = i * (max_cost - min_cost)/colors.length + min_cost;
            var scaled_level = flat_level; // = Math.floor(flat_level * sigmoid(flat_level, max_cost));
            var level = scaled_level.toExponential(0);
			color_scale += color + level + ' ';
		}
        console.log('\n' + color_scale);
        console.log(reset);
	}

    clear() {

        this.target = null;
        this.cost = 0;
        this.last_delta = 0;
        this.history = [this.current];
        this.zlevel = DEFAULT_ZOOM;
	}

	getTarget() {
		if (this.target != null)
			return node_data[this.target][TEXT];
		else
			return '';
	}

	getJumps() {
		console.log('there');
		if (this.target != null)
		{
			var parent = dijkstra(graph, node_data, this.current, this.target);
			var [cost, jumps] = get_cost_and_distance(parent, this.target, node_data);
			console.log('target is: ', this.target, node_data[this.target][TEXT]);
			return jumps;
		}
		else
			return '';
	}


} // end class Navigator
	/*

	   DEFAULT_ZOOM,
	   colors,
	   MIN_ZOOM
	   TEXT, COST
	   dijkstra
	   get_cost_and_distance
	   minmax
	   MIN_ZOOM

	 */
