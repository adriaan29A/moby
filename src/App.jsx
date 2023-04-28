import { useEffect, useState } from "react"
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { Synset } from "./Synset.jsx"
import { CreateNavigator } from "./nav.js"

export default function App() {

	const [history, setHistory] = useState(() => {
		const localValue = localStorage.getItem("HISTORY")
		if (localValue == null) {
			console.log('localValue null')
			return []
		}
		return JSON.parse(localValue)
	})

	useEffect(() => {
		localStorage.setItem("HISTORY", JSON.stringify(history))
	}, [history])


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


	function setCurrent(syn) {
		setHistory((history) => {
			return [
				...history, // adds new node
				{id: crypto.randomUUID(), synonym: syn },
			]
		})
	}

	function getCurrent() {
		console.log('history: ', history);
		return (history.length != 0) ? history[history.length-1].synonym : null;
	}

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

	//
	// here I want to persist the entire Navigator, right? Exactly what is thzt...
	//


	var nav = CreateNavigator(getCurrent());

	return (
		<>
			<NewTodoForm onSubmit = {setCurrent} />
			<Synset synonym = {getCurrent} onClick = {setCurrent} />
	   </>
	)

}
