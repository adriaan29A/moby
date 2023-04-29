import {useState} from "react"
import  { nodeid_from_text } from "./core.js";

export function NewTodoForm({nav, onSubmit}) {

	const [newItem, setNewItem] = useState("");

	function handleSubmit(e) {
		e.preventDefault()
		// if (newItem === "") return

		// set the current node on the nav object
		// which will be refreshed in state
		nav.current = nodeid_from_text(newItem);
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
				<button className="btn" >Search</button>
				<button className="btn" >+</button>
				<button className="btn" style = {{"text-align": "center", "vertical-align": "center" }} >-</button>
				<button className="btn" >Back</button>
				<button className="btn" style = {{"margin-left":"20px"}} >Navigate</button>
				<button className="btn" >Next</button>
				<button className="btn" >Clear</button>
				<label style = {{"margin-left":"20px"}}> Jumps: </label>
			</div>

		</form>
	)
}
