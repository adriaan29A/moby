import {useState} from "react"
import nodes from "./nodes.json"
import  { nodeid_from_text, TEXT} from "./core.js";

var  f_hack_start_nav_session = false; // HACKOMATIC

export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		e.preventDefault()

		if (e.target.id == "navigate") {
			if (newItem != "") {
				nav.set_target(nodeid_from_text(newItem, nodes));
			}
			else {
				nav.clear(true);
				// move this to reset_target or some such
				// nav.target = null; nav.jumps = 0; nav.cost = 0;
			}
			f_hack_start_nav_session = false;
		}
		else {
			nav.goto(newItem);
		}
		onSubmit(nav.get());
		setNewItem("");
	}

	// nav.integrated_zoom sets nav.zlevel and nav.xfactor to the
	// appropriate values to acheive the desired zoom.
	function handleOnClick(e) {
		e.preventDefault();

		if (e.target.id == "zoomin") {
			nav.integrated_zoom(true);
		}
		else if (e.target.id =="zoomout") {
			nav.integrated_zoom(false);
		}
		else if (e.target.id == "navigate") {
			f_hack_start_nav_session = true;
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
					placeholder = { "word or phrase"  }
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
				<label title = "Zoom level" style = {{"margin-left":"10px"}}> {nav.zlevel.toExponential(0)} </label>

				{/*-- Current --
				<label style = {{"margin-left":"10px"}}> &quot;{ nodes[nav.current][TEXT] }&quot;</label> */}

				{/*-- Current Zoom level--
				<label style = {{"margin-left":"20px", color:"DeepSkyBlue"}}>Zoom:</label>
				<label title = "Zoom level" style = {{"margin-left":"1px"}}> {nav.zlevel.toExponential(0)} </label> */}

				{/*-- Target--*/}
				<label style = {{ color:"DeepSkyBlue", "margin-left":"10px"}}>
					{(nav.target != null) ? "Target:" : ""}
				</label>
				<label style = {{"margin-left":"5px"}}>{nav.getTargetText()}</label>

				{/*-- Jumps--*/}
				<label style = {{color:"DeepSkyBlue", "margin-left":"10px"}}> {(nav.target != null) ? "Jumps:" : ""} </label>
				<label style = {{"margin-left":"5px"}}> { (nav.target != null) ? nav.jumps : ""  } </label>

				{/*-- Cost -- */}
				<label style = {{color:"DeepSkyBlue", "margin-left":"10px"}}> {(nav.target != null) ? "Cost:" : ""} </label>
				<label style = {{"margin-left":"5px", color: (nav.delta <= 0 || nav.current == nav.origin) ? "Lime" : "Red" }}>
				{ (nav.target != null) ? nav.cost.toLocaleString() : ""  } </label>

				{/*-- Totals -- */}
				<label style = {{color:"DeepSkyBlue", "margin-left":"10px"}}> {(nav.target != null) ? "Totals:" : ""} </label>
				<label style = {{"margin-left":"5px"}}> { (nav.target != null) ? nav.total.toLocaleString() + " / " + nav.jumpstot : ""  }


				</label>

			</div>
			<div style = {{"padding-top": "5px"}} >
				<label > { (nav.target != null) ? nav.getHistory() : "" } </label>
			</div>

		</form>

	)
}
