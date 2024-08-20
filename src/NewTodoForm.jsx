import {useState} from "react"
import nodes from "./nodes.json"
import  { nodeid_from_text, TEXT} from "./core.js";
// ?newxfinity!5.5

export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		e.preventDefault()

		if (e.target.id == "navigate") { // bug -ambiguous

			if (newItem != "") {
				if (nav.target == null)
					nav.set_target(nodeid_from_text(newItem, nodes));
				else {
					nav.clear();
				}
			}
			else {
				nav.clear(false); // clear targeting info
			}
/*

			if (newItem != "") {
				nav.set_target(nodeid_from_text(newItem, nodes));
			}
			else {
				nav.clear(false); // clear targeting info
			}
*/
		}
		else {
			nav.goto(newItem); // bug - resetting history twice?
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
			handleSubmit(e);
			return; //avoids double call to onSubmit (below)
		}
		else if (e.target.id == "back") {
			nav.back();
		}
		else if (e.target.id == "next") {
			nav.next();
		}
		onSubmit(nav.get());
	}

	function funky(e) {
		nav.clear(false);
		setNewItem(e.target.value);
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

				{/*-- Go/Nav/Clear--*/}
				<button className="btn" id = "go" title = "Search word or phrase" style = {{"margin-left":"1px"}} >Go</button>
				<button className="btn" id = "navigate" title = "Navigate to word or phrase" onClick = { handleOnClick }>

				{ (nav.target == null) ? "Nav" : "Clear" } </button>

				{/*-- Back/Next--*/}
				<button className="btn" id = "back" title = "Back" onClick={ handleOnClick } style = {{"margin-left":"10px"}}>&laquo;</button>
				<button className="btn" id = "next" title = "Next" onClick = { handleOnClick }>&raquo;</button>

				{/*-- ZoomIn/ZoomOut--*/}
				<button className="btn" title = "Zoom in" id = "zoomin" onClick = { handleOnClick } style = {{"margin-left":"10px"}}>+</button>
				<button className="btn" title = "Zoom out" id = "zoomout" onClick = { handleOnClick } >&minus;</button>

				{/*-- Current Zoom level--*/}
				<label title = "Zoom level" style = {{"margin-left":"10px"}}> {nav.getCostText(nav.zlevel)} </label>

				{/*-- Target--*/}
				<label style = {{ color:"DeepSkyBlue", "margin-left":"15px"}}>
					{(nav.target != null) ? "Target:" : ""}
				</label>
				<label style = {{"margin-left":"5px"}}> {nav.getTargetText()}</label>

				{/*-- Jumps-- */}
				<label style = {{color:"DeepSkyBlue", "margin-left":"15px"}}> {(nav.target != null) ? "Jumps / Cost:" : ""} </label>

				<label style = {{"margin-left":"5px", color: (nav.deltaj <= 0 || nav.current == nav.origin) ? "Lime" : "Red" }}>
				{ (nav.target != null) ? nav.jumps : "" } </label>

				{/*-- Cost-- */}
				<label style = {{"margin-left":"4px", "margin-right":"4px"}} > { (nav.target != null) ? " / " : "" } </label>

				{/*
				<label style = {{color: (nav.delta <= 0 || nav.current == nav.origin) ? "Lime" : "Red" }}>
				{ (nav.target != null) ? nav.cost.toExponential(1) : "" } </label>
				 */}

				<label style = {{color: (nav.delta <= 0 || nav.current == nav.origin) ? "Lime" : "Red" }}>
				{ (nav.target != null) ? nav.getCostText() : "" } </label>


				{/*-- Score -- */}
				<label style = {{color:"DeepSkyBlue", "margin-left":"15px"}}> {(nav.target != null) ? "Score:" : ""} </label>
				<label style = {{"margin-left":"5px"}}> { (nav.target != null) ? nav.jumpstot + " / " +  nav.getCostText(nav.total) : ""  }
				</label>

				{/*-- Cheats -- */}
				<label style = {{color:"DeepSkyBlue", "margin-left":"15px"}}> {(nav.target != null) ? "Cheats:" : "" }
				</label>

				<label style = {{"margin-left":"5px"}}> { (nav.target != null) ? nav.cheats : "" }
				</label>

			</div>
			<div style = {{ color: "SteelBlue", "padding-top": "5px"}} >
				<label > { (nav.target != null) ? nav.getHistoryText() : nav.getCurrentText() } </label>
			</div>

		</form>

	)
}
