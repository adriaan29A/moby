



export function SynsetRow({row, onClick}) {

	function handleOnClick(e) {
		e.preventDefault()
		console.log('e.target.id: ', e.target.id);
		console.log('e is: ', e);
		onClick(e);

	}

	return (
		<>
		<li className = "quux1">
		{
			row.map(function(node, index, array) {
				return (<><button id = {row[index].nodeid} onClick={handleOnClick}
								  style = {{ "color": row[index].color }} className="quuxbutton1">

							   {array[index].text}

						  </button></>) }
				   )
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
