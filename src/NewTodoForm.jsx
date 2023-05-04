import {useState} from "react"
import nodes from "./nodes.json"
import  { nodeid_from_text } from "./core.js";

export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		console.log('handlesubmit:', e);
		e.preventDefault()
		// if (newItem === "") return

		// set the current node on the nav object
		// which will be refreshed in state
		nav.current = nodeid_from_text(newItem, nodes);
		onSubmit(nav.get());
		setNewItem("")
	}

	// nav.integrated_zoom sets nav.zlevel and
	// nav.xfactor to the appropriate
	// values to acheive the desired zoom.
	function handleOnClick(e) {
		console.log('handlesClick:', e);

		e.preventDefault();

		if (e.target.id == "zoomin") {
			nav.zoom(true);
		}
		else if (e.target.id =="zoomout") {
			nav.zoom(false);
		}
		else if (e.target.id =="xin") {
			nav.xoom(true);
		}
		else if (e.target.id =="xout") {
			nav.xoom(false);
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
					id="item"
					/>

				<button className="btn" > Go </button>

				<button className="btn"style = {{"margin-left":"5px"}} >&laquo;</button>
				<button className="btn" disabled>&raquo;</button>

				<label style = {{"margin-left":"10px"}}>Filter::</label>
				<label style = {{"margin-left":"2Px"}}> {nav.zlevel.toExponential(0)} </label>

				<button className="btn" id = "zoomin" style = {{"margin-left":"5px"}} onClick = { handleOnClick  } >&minus;</button>
				<button className="btn" id = "zoomout" onClick = { handleOnClick } >+</button>

				<label style = {{"margin-left":"10px"}}>Expand:</label>
				<label style = {{"margin-left":"2Px"}}> {nav.xfactor} </label>

				<button className="btn" id = "xout" style = {{"margin-left":"5px"}} onClick = { handleOnClick } >&minus;</button>
				<button className="btn" id = "xin" onClick = { handleOnClick } >+</button>
				{/*
				<button className="btn" style = {{"margin-left":"20px"}} >Nav</button>
				<label style = {{"margin-left":"10px"}}> Target: </label>
				<label style = {{"margin-left":"10px"}}> solstice </label>
				<label style = {{"margin-left":"10px"}}> Jumps: </label>
				<label style = {{"margin-left":"10px"}}> 4 </label> */}

			</div>

		</form>
	)
}
