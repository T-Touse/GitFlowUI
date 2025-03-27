import app from "../app/app.html";

function getFile(req:Request){
	const url = new URL(req.url);
	return "./app" + url.pathname;
}

async function fileRoute(req:Request){
	const file = getFile(req)
	try {
		return new Response(await Bun.file(file));
	} catch (e) {
		console.error(e)
		return new Response("404 Not Found", { status: 404 });
	}
}

export const server = Bun.serve({
	routes:{
		"/assets/lang/*":async (req)=>{
			const file = getFile(req)
			try{
				return new Response(await Bun.file(file).text())
			}catch(err){
				console.error(err)
				return new Response(await Bun.file("./app/assets/lang/en.ini").text())
			}
		},
		"/assets/*":fileRoute,
		"/":app,
	},
	websocket:{
		message(ws,message){},
		open(ws){}
	}
})
console.log(`Listening on ${server.url}`);