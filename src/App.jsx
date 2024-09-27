import { useEffect, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { Synset } from "./Synset.jsx"
import { CreateNavigator } from "./nav.js"
import { random_node } from "./core.js"

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
 
	const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [] );

  return windowDimensions;
}


export default function App() {

	var nav = CreateNavigator();

	const { height, width } = useWindowDimensions();

	const [navctx, setNavctx] = useState(() => {
		const localValue = localStorage.getItem("NAVCTX15")
		if (localValue == null) {
			console.log('localValue null')

			nav.current = nav.origin = random_node();
			nav.history = [nav.current];

			return nav.get();
		}
		return JSON.parse(localValue)
	})

	useEffect(() => {
		localStorage.setItem("NAVCTX15", JSON.stringify(navctx))
	}, [navctx])

	function setCtx(ctx) {
		setNavctx((navctx) => {return ctx });

	}

	nav.set(navctx);

	return (
		<>
			<Synset nav = {nav} width = {width} height = {height} onClick = { setCtx } />
			<NewTodoForm nav = { nav } onSubmit = { setCtx } />	
		</>
	)

}
