import { useEffect, useState } from "react"
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { Synset } from "./Synset.jsx"
import { CreateNavigator } from "./nav.js"
import { nodeid_from_text, random_node } from "./core.js"

export default function App() {


/*--
	const [todos, setTodos] = useState(() => {
		const localValue = localStorage.getItem("ITEMS")
		if (localValue == null) {
			console.log('localValue null')
			return []
		}
		return JSON.parse(localValue)
	})

	useEffect(() => {
		localStorage.setItem("ITEMS", JSON.stringify(todos))
	}, [todos])

	--*/



/*--
	function addTodo(title){
		setTodos((currentTodos) => {
			return [
				...currentTodos, // adds new todos
				{id: crypto.randomUUID(), title, completed: false },
			]
		})
	}

    // hah - overwrites the todo with the ...todo below.
	function toggleTodo(id, completed) {
		setTodos(currentTodos => {
			return currentTodos.map(todo => {
				if (todo.id === id) {
					return { ...todo, completed } //overwrites existing todo
				}
				return todo
			})
		})
	}

	function deleteTodo(id) {
		setTodos(currentTodos => {
			return currentTodos.filter(todo => todo.id !== id)
		})
	}

	--*/

	var nav = CreateNavigator();

	const [navctx, setNavctx] = useState(() => {
		const localValue = localStorage.getItem("NAVCTX1")
		if (localValue == null) {
			console.log('localValue null')

			nav.current = nav.origin = random_node();
			nav.history = [nav.current];

			return nav.get();

		}
		return JSON.parse(localValue)
	})

	useEffect(() => {
		localStorage.setItem("NAVCTX1", JSON.stringify(navctx))
	}, [navctx])


	function setCtx(ctx) {
		console.log('in setCtx, ctx = ', ctx);
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
