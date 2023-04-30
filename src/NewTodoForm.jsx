import {useState} from "react"
import nodes from "./nodes.json"
import  { nodeid_from_text } from "./core.js";

export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		e.preventDefault()
		// if (newItem === "") return

		// set the current node on the nav object
		// which will be refreshed in state
		nav.current = nodeid_from_text(newItem, nodes);
		onSubmit(nav.get());
		setNewItem("")
	}

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
				<button className="btn" >Go</button>
				<button className="btn" >+</button>
				<button className="btn"  >&minus;</button>
				<button className="btn" >&laquo;</button>
				<button className="btn" style = {{"margin-left":"20px"}} >Nav</button>
				<button className="btn" disabled>&raquo;</button>
				<button className="btn" disabled>Clear</button>
				{/*<label style = {{"margin-left":"20px"}}> Jumps: </label> */}
			</div>

		</form>
	)
}
