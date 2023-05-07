import {useState} from "react"
import nodes from "./nodes.json"
import  { nodeid_from_text, TEXT} from "./core.js";

var  session = false; // HACKOMATIC

console.log('1\)', session );
export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		console.log('handlesubmit:', e);
		e.preventDefault()

//	    if (newItem === "") return

		if (e.target.id == "navigate") {
			if (nav.target != null) {
				console.log("setting nav.target to null");
				nav.target = null;
			}
			else if (newItem != "") {
				nav.target = nodeid_from_text(newItem, nodes);
				console.log('2\)', session );
				console.log("newItem: ", newItem);
			}
			session = false;
		}
		else {
			nav.current = nodeid_from_text(newItem, nodes);
		}

		onSubmit(nav.get());
		setNewItem("");

	}

	// nav.integrated_zoom sets nav.zlevel and
	// nav.xfactor to the appropriate
	// values to acheive the desired zoom.
	function handleOnClick(e) {
		console.log('handlesClick:', e);

		e.preventDefault();

		if (e.target.id == "zoomin") {
			nav.integrated_zoom(true);
		}
		else if (e.target.id =="zoomout") {
			nav.integrated_zoom(false);
		}
		else if (e.target.id == "navigate") {
			session = true;
			console.log('3\)', session );
			handleSubmit(e);
			return;
		}
		onSubmit(nav.get());
	}

    // One big honkin form.
	return (
		<form onSubmit={handleSubmit} className="new-item-form">
			<div className="form-row" style = {{"max-width": "200px"}}>
				<label htmlFor="item"></label>
				<input
					value={newItem}
					onChange={e => setNewItem(e.target.value)}
					type="text"
					placeholder = { nodes[nav.current][TEXT] }
					id="item"/>


				<button className="btn" title = "Search word or phrase" style = {{"margin-left":"1px"}} >Go</button>
				<button className="btn" id = "navigate" title = "Navigate to word or phrase" onClick = { handleOnClick }>Nav</button>

				<button className="btn"style = {{"margin-left":"10px"}} title = "Back">&laquo;</button>
				<button className="btn" disabled title = "Next">&raquo;</button>

				<label style = {{"margin-left":"2px"}}></label>
				<button className="btn" title = "Zoom in" id = "zoomin" style = {{"margin-left":"10px"}} onClick = { handleOnClick } >+</button>
				<button className="btn" title = "Zoom out" id = "zoomout" onClick = { handleOnClick } >&minus;</button>

				<label style = {{"margin-left":"20px", color:"DeepSkyBlue"}}>Zoom:</label>
				<label title = "Zoom level" style = {{"margin-left":"1Px"}}> {nav.zlevel.toExponential(0)} </label>

				<label style = {{ color:"DeepSkyBlue", "margin-left":"20px"}}>
					{(nav.target != null) ? "Target: " : ""}
				</label>

				<label style = {{"margin-left":"5px"}}> { nav.getTarget() } </label>

				<label style = {{color:"DeepSkyBlue", "margin-left":"10px"}}> {(nav.target != null) ? "Jumps: " : ""} </label>

				<label style = {{"margin-left":"5px"}}> { nav.getJumps()  } </label>

			</div>

		</form>

	)
}
