import {useState} from "react"
import { SynsetRow } from  "./SynsetRow";

export function Synset({nav, onClick}) {

	function handleOnClick(e) {
		nav.goto(parseInt(e.target.id));
		
		onClick(nav.get());
	}

	var fontsize = ''; var displayList = null; var nsyns = 0;
	[nsyns, displayList] = nav.getDisplayInfo();

	if (nsyns <= 300) 
		fontsize = "1em";

	else if (nsyns <= 500)
		fontsize =  ".9em";
	
	else if (nsyns <= 1000)
		fontsize = ".8em";

	else if (nsyns <= 1500)
		fontsize = ".6em";
	
	else if (nsyns <= 2000)
		fontsize = ".5em";

	else if (nsyns <= 2500)
		fontsize = ".4em";
	else if (nsyns <= 3000)
		fontsize =".3em";
	else 
		fontsize = ".2em";	

		
	return(
		<ul className="quux" style = {{"font-size" : fontsize}}>
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
