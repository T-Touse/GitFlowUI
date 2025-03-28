import { $ } from "bun";
const GIT_FILE = process.env.GIT||"git";
export const $GIT = async (strings:TemplateStringsArray,...values:any[])=>{
	const cmd = strings.raw.reduce((b,s:string,n:number)=>{
		b = b.concat(s)
		b = b.concat(values[n]||"")
		return b
	},"")
	console.log(this)
	const args:string[] = cmd.split(' ')
	const result = await $`${GIT_FILE} ${args}`
	const exit = result.exitCode
	const text = result.text()
	return text
}