import {useState} from "react"
import { SynsetRow } from  "./SynsetRow";


export function Synset({nav, extent, onClick}) {
	function handleOnClick(e) {
		nav.goto(parseInt(e.target.id));
		onClick(nav.get());
	}

	var params = {}; var displayList = null;

	[params, displayList] = nav.getDisplayInfo(extent);
//	[params, displayList] = nav.getDisplayInfo2(extent);

    console.log('params: ' + params)

	return(
        <ul className="quux" style = {{"font-size" : params.font_size}}>
			{displayList.map(function(displayList, index, array) {
				return (
					<SynsetRow onClick = {handleOnClick}
						   //font_size = {params.font_size}
						   row = {displayList}
					/>
				)
			})}
		</ul>
	)
}
