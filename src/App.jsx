import { useEffect, useState } from "react"
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { Synset } from "./Synset.jsx"
import { CreateNavigator } from "./nav.js"
import { random_node } from "./core.js"

export default function App() {

	var nav = CreateNavigator();

	const [navctx, setNavctx] = useState(() => {
		const localValue = localStorage.getItem("NAVCTX6")
		if (localValue == null) {
			console.log('localValue null')

			nav.current = nav.origin = random_node();
			nav.history = [nav.current];

			return nav.get();
		}
		return JSON.parse(localValue)
	})

	useEffect(() => {
		localStorage.setItem("NAVCTX6", JSON.stringify(navctx))
	}, [navctx])


	function setCtx(ctx) {
		setNavctx((navctx) => {return ctx });
	}

	nav.set(navctx);

	return (
		<>
			<NewTodoForm nav = { nav } onSubmit = { setCtx } />
			<Synset nav = { nav } onClick = { setCtx } />
	   </>
	)

}
