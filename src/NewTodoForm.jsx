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


	      // This refreshes the view
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
		else if (e.target.id == "forward") {
		    if (nav.target != null)
			nav.next();
		    else
			nav.forward();
		}
	        else if (e.target.id == "cheat") {
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
	<>
	    <form onSubmit={handleSubmit} className="new-item-form">
		<div className="form-row" style = {{"max-width": "50px"}}>
		    <label htmlFor="item"></label>
		    <input
			value={newItem}
			onChange={e => setNewItem(e.target.value)}
			type="text"
			placeholder = { "word or phrase"  }
			id="item"/>

		    {/*-- Go/Nav/Clear--*/}
		    <button className="btn" id = "go" title = "Search word or phrase" style = {{"margin-left":"1px"}} >&#128270; </button>
		    <button className="btn" id = "navigate" title = {(nav.target == null) ? "Play Game: Type in a word/phrase and start navigating" : "End Game"} onClick = { handleOnClick }>

			{ (nav.target == null) ? ("\uD83C\uDFAE") : "\uD83D\uDED1" }

		    </button>


		    {/*-- ZoomIn/ZoomOut--*/}
		    <button className="btn" title = "Zoom in" id = "zoomin" onClick = { handleOnClick } style = {{"margin-left":"10px"}}>&#x2b;</button>
		    <button className="btn" title = "Zoom out" id = "zoomout" onClick = { handleOnClick } >&#x2212;</button>

		    {/*-- Back/Next--*/}
		    <button className="btn" id = "back" title = "Back" onClick={ handleOnClick } style = {{"margin-left":"10px"}}>&#x276E;</button>
		    <button className="btn" id = "forward" title = "Next" onClick = { handleOnClick }>&#x276F;</button>


		    {/*-- Current Zoom level--*/}
		    <label title = "Zoom level" style = {{"margin-left":"10px"}}> {nav.getCostText(nav.zlevel)} </label>

		    {/*-- Target--*/}
		    <label style = {{ color:"DeepSkyBlue", "margin-left":"15px"}}>
					{(nav.target != null) ? "Target:" : ""}
		    </label>
		    <label style = {{"margin-left":"5px"}}> {nav.getTargetText()}</label>


		</div>

		{/* History (shown only during game */}
		<div className = "form-row" style = {{ color: "SteelBlue", "padding-top": "10px", "max-width": "50px", "font-size": "16px"}} >
		    <label > { (nav.target != null)  ? nav.getHistoryText() : nav.getCurrentText() } </label>
		</div>

		<div className = "form-col">

		    <label style = {{"font-size" : "12px", color:"DeepSkyBlue", "margin-top":"0"}}>
			{ (nav.target != null) ? "Best To Target:" : "" }
		    </label>

		    {/*-- Cost-- */}
		    <div className = "form-row">
			{/*<label style = {{"margin-left":"4px", "margin-right":"4px"}} > { (nav.target != null) ? " / " : "" } </label> */}

			<label style = {{"margin-left":"5px"}}>
			{(nav.target != null) ? "Cost:" : ""} </label>

			<label style = {{color: (nav.delta <= 0 || nav.current == nav.origin) ? "Lime" : "Red" }}>
			{ (nav.target != null) ? nav.getCostText() : "" } </label>
		    </div>

		    <div className ="form-row">
			{/*-- Jumps-- */}
			<label style = {{ "margin-left":"5px"}}>
			{(nav.target != null) ? "Jumps:" : ""} </label>
			<label style = {{"margin-left":"5px", color: (nav.deltaj <= 0 || nav.current == nav.origin) ? "Lime" : "Red" }}>
			    { (nav.target != null) ? nav.jumps : "" }
			</label>
		    </div>


		    <div style = {{"margin-top": "20px"}}>
			<label style = {{"font-size" : "12px", color:"DeepSkyBlue"}}>
			    { (nav.target != null) ? "Game Score:" : "" }
			</label>
		    </div>

		    <div className ="form-row">
			{/*-- Cost-- */}
			<label style = {{"margin-left":"5px" }} >  { (nav.target != null) ? "Cost:" : "" } </label>
			<label style = {{"margin-left":"5px" }}>
			{ (nav.target != null) ? nav.getCostText(nav.total) : "" } </label>
		    </div>
		    <div className ="form-row">
			{/*-- Cheats-- */}
			<label style = {{"margin-left":"5px"}}>
			{ (nav.target != null) ? nav.cheats : "" } </label>
			<label style = {{"margin-left":"5px"}}>
			{(nav.target != null) ? "Bogeys" : ""} </label>
		    </div>
		    <div className ="form-row">
			{/*-- Jumps-- */}
			<label style = {{"margin-left":"5px" }}>
			{ (nav.target != null) ? nav.jumpstot : "" } </label>
			<label style = {{"margin-left":"5px"}}>
			{(nav.target != null) ? "Jumps" : ""} </label>
		    </div>
		    <div style = {{"margin-top": "10px", "margin-left":"5px", "display" : (nav.target != null) ? "block" : "none"}}>
			{/*	<button id = "cheat" className = "btn" title = "Go to the next best synonym along a minimum cost path"
				onClick = {handleOnClick}> Bogey </button> */}
		    </div>

		</div>
	    </form>

	</>

	)
}
