
export function DisplayLine1({row}) {

	console.log('row: ', row);
	console.log('row[0]: ', row[0].text);
	return (

		<li className = "quux1">
			{row.length === 0 && "No words"}

			{
				row.map(function(node, index, array) {
					return ( <a href = "javascript:void(0);" onclick="myFunc();"
								style = {{ "color": row[index].color }} >

								 {array[index].text}

							 </a> ) } )
			}
		</li>
	)
}






{/*
//	return ( <a href="javascript:void(0);" onclick="myFunction();" style = {{"color": "blue"}} >  {{"moon"}} </a> ) } ) }
//			return ( <a href="foo"> {word[0]} </a> ) } ) }
*/}
