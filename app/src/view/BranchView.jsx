import {useRef,useEffect} from "react"
export function BranchView() {
	const branches = ["main", "develop", "feature-x", "bugfix-123"];
	const ref = useRef(null)
	useEffect(()=>{
		const graph = ref.current
		const dev = graph.main.branch()
		dev.commit("c 1")
		dev.commit("c 2")
		graph.main.merge(dev)
		graph.render()
	},[])
	return (
		<div className="branch-view">
			<h2>Branches</h2>
			<ul>
				{branches.map((branch, index) => (
					<li key={index}>{branch}</li>
				))}
			</ul>
			<graph-version ref={ref} />
		</div>
	);
}
