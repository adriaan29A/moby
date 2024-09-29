import {useState} from "react"
import { SynsetRow } from  "./SynsetRow";

export function Synset({nav, extent, onClick}) {
	//console.log("portal values w, h = " + extent.width + " " + extent.height);
	function handleOnClick(e) {
		nav.goto(parseInt(e.target.id));
		onClick(nav.get());
	}

	var fontsize = ''; var displayList = null; var nsyns = 0; var chars = 0;

	// Find #rows, #cols required to display
	// from #chars and ar (aspect ratio)
	// rows * cols = chars, 
	// cols /(1.5 * rows) = ar
    /// ..
	// ==> rows = chars / cols
	// ==> cols^2 = ar * chars
	
	[chars, nsyns, displayList] = nav.getDisplayInfo();
/*
	// this calculation will enable 
	// the necessary font-size to be determined.
	var ar = extent.width / extent.height;
	var cols = Math.sqrt(3.0 * chars * ar);
	var rows = chars / cols; 
	var font_size = extent.width / cols

		

	if (font_size > 16) font_size = 16; 

	console.log("width: " + extent.width + 'px');
	console.log("height: " + extent.height) + 'px';
	console.log("rows: " + rows);
	console.log("cols: " + cols);
	console.log("font_size = " + font_size); 
*/

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
