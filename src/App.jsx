import { useEffect, useState } from "react"
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
//import {DisplayLine } from "./DisplayLine.jsx"
import { Synset } from "./Synset.jsx"
//import graph from "./graph.json"
//import nodeinfo from "./nodes.json"

export default function App() {
	//const [todos, setTodos] = useState([]);

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

	return (
		<>
			<Synset/>
			<NewTodoForm onSubmit = {addTodo} />
		    <h1 className="header"> Todo List </h1>
			<TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />

	   </>
	)

}
