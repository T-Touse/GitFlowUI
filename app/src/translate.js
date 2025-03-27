const LANG = {}

async function loadLang(res){
	if(res.status == 404) throw `${res.url} not found`
	const text = (await res.text()??"")
	const matches = text.matchAll(/((\w|\.)+)\s*\=\s*(.*)\s*\n/g)||[]
	matches.forEach((match)=>{
		const [_,key,__,value] = match
		LANG[key] = value
	})
	console.log(LANG)
	dispatchEvent(new CustomEvent("changelang"))
}
fetch(`assets/lang/${navigator.language}.ini`)
.then(loadLang)
.catch(async err=>{
	console.error(err,"\n",`loading en`)
	loadLang(await fetch(`assets/lang/en.ini`))
})

export function tl(key){
	return LANG[key]||key
}
window.tl = tl;