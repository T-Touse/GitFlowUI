const URL = location.toString().replace("http","ws")
const ws:WebSocket = new WebSocket(`${URL}/git`)
interface GitRequest{
	request:string;
	resolve:(_:boolean)=>void;
}
const STACKS:GitRequest[] = []
async function applyRequest(req:string){
	ws.send(req)
}
async function request(req?:Record<string,any>):Promise<boolean>{
	const request = JSON.stringify(req = {})
	return new Promise(async resolve=>{
		if(ws.readyState == ws.CONNECTING){
			STACKS.push({request,resolve})
		}else{
			await applyRequest(request)
			resolve(false)
		}
	})
}