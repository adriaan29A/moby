import {useState} from "react"
import nodes from "./nodes.json"
import  { nodeid_from_text, TEXT} from "./core.js";

var  session = false; // HACKOMATIC

export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		console.log('handlesubmit:', e);
		e.preventDefault()

//	    if (newItem === "") return

		if (e.target.id == "navigate") {

			if (newItem != "") {
				nav.set_target(nodeid_from_text(newItem, nodes));
			}
			else {
				// move to reset_target or some such
				nav.target = null; nav.jumps = 0; nav.cost = 0;
			}
			session = false;
		}
		else {
			nav.set_current(newItem);
		}

		onSubmit(nav.get());
		setNewItem("");

	}

	// nav.integrated_zoom sets nav.zlevel and
	// nav.xfactor to the appropriate
	// values to acheive the desired zoom.
	function handleOnClick(e) {
		e.preventDefault();

		if (e.target.id == "zoomin") {
			nav.integrated_zoom(true);
		}
		else if (e.target.id =="zoomout") {
			nav.integrated_zoom(false);
		}
		else if (e.target.id == "navigate") {
			session = true;
			handleSubmit(e);
			return; //avoids double call to onSubmit
		}
		else if (e.target.id == "back") {
			nav.back();
		}
		else if (e.target.id == "next") {
			nav.next();
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

				{/*-- Go/Nav--*/}
				<button className="btn" id = "go" title = "Search word or phrase" style = {{"margin-left":"1px"}} >Go</button>
				<button className="btn" id = "navigate" title = "Navigate to word or phrase" onClick = { handleOnClick }>Nav</button>

				{/*-- Back/Next--*/}
				<button className="btn" id = "back" title = "Back" onClick={ handleOnClick } style = {{"margin-left":"10px"}}>&laquo;</button>
				<button className="btn" id = "next" title = "Next" onClick = { handleOnClick }>&raquo;</button>

				{/*-- ZoomIn/ZoomOut--*/}
				<button className="btn" title = "Zoom in" id = "zoomin" onClick = { handleOnClick } style = {{"margin-left":"10px"}}>+</button>
				<button className="btn" title = "Zoom out" id = "zoomout" onClick = { handleOnClick } >&minus;</button>

				{/*-- Current Zoom level--*/}
				<label style = {{"margin-left":"20px", color:"DeepSkyBlue"}}>Zoom:</label>
				<label title = "Zoom level" style = {{"margin-left":"1Px"}}> {nav.zlevel.toExponential(0)} </label>

				{/*-- Target--*/}
				<label style = {{ color:"DeepSkyBlue", "margin-left":"20px"}}>
					{(nav.target != null) ? "Target:" : ""}
				</label>
				<label style = {{"margin-left":"5px"}}> { nav.getTarget() } </label>

				{/*-- Jumps--*/}
				<label style = {{color:"DeepSkyBlue", "margin-left":"20px"}}> {(nav.target != null) ? "Jumps:" : ""} </label>
				<label style = {{"margin-left":"5px"}}> { (nav.target != null) ? nav.jumps : ""  } </label>

				{/*-- Cost -- */}
				<label style = {{color:"DeepSkyBlue", "margin-left":"20px"}}> {(nav.target != null) ? "Cost:" : ""} </label>
				<label style = {{"margin-left":"5px"}}> { (nav.target != null) ? nav.cost : ""  } </label>

			</div>

		</form>

	)
}
