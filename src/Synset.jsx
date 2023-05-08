import {useState} from "react"
import { SynsetRow } from  "./SynsetRow";

export function Synset({nav, onClick}) {

	function handleOnClick(e) {
		nav.goto(parseInt(e.target.id));
		onClick(nav.get());
	}

	const displayList = nav.getDisplayInfo();

	return (
		<ul className="quux">
			{displayList.map(function(displayList, index, array) {
				return (
					<SynsetRow onClick = {handleOnClick}
						row = {displayList}
					/>
				)
			})}
		</ul>
	)
}
