const style = document.createElement('style')
document.head.appendChild(style)

export function Style({ children }) {	
	return (<>{children}</>)
}
