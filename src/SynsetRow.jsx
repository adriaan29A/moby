import { Tooltip } from "./Tooltip";

const FONT_SIZE_HACK_MED = 12;
export function SynsetRow({row, font_size, onClick}) {

    function handleOnClick(e) {
	e.preventDefault()
	console.log('SynsetRow Click');
	onClick(e);
    }

    return (
	<>
	    <li className = "quux1">
		{
		    row.map(function(node, index, array) {
			// Skip tooltip for black (disabled) nodes
			if (row[index].color == "Black") {
				return (<><button
					id = {row[index].nodeid}
					onClick = {null}
					style = {{ "color": row[index].color }}
					className="quuxbutton1">
					{array[index].text}
				</button></>);
			}

			// Use custom Tooltip component for enabled nodes
			return (
				<Tooltip
					key={row[index].nodeid}
					cost={row[index].cost}
					syns={row[index].syns}
					text={row[index].text}
				>
					<button
						id = {row[index].nodeid}
						onClick = {handleOnClick}
						style = {{ "color": row[index].color }}
						className="quuxbutton1">
						{array[index].text}
					</button>
				</Tooltip>
			);
		    })
		}
	    </li>
	</>
    )
}



{/*
  return (<button className = "quuxbutton1" onclick= {myFunc(true)} type="button">

return (<button onclick="location.href='http://www.example.com'" type="button">
         www.example.com</button>

	return ( <a href = '#' onClick = {() => return true }
	 style = {{ "color": row[index].color }} >


   return ( <a href={void(0)} onClick={this.onClick} style = {{ "color": row[index].color }}>

	return ( <a href="https://www.foo.com/" style = {{ "color": row[index].color }}>


   return ( <a href = "javascript:void(0);" onclick="myFunc();"
   style = {{ "color": row[index].color }} > */}

{/*
	return ( <a href="javascript:void(0);" onclick="myFunction();" style = {{"color": "blue"}} >  {{"moon"}} </a> ) } ) }
			return ( <a href="foo"> {word[0]} </a> ) } ) }
*/}
