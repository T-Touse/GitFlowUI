import { $ } from "bun";

const GIT_FILE = process.env.GIT||"git";
const GIT = async (strings:TemplateStringsArray,...values:any[])=>{
	const cmd = strings.raw.reduce((b,s:string,n:number)=>{
		b = b.concat(s)
		b = b.concat(values[n]||"")
		return b
	},"")
	const result = await $`${GIT_FILE} ${cmd}`
	const exit = result.exitCode
	const text = result.text()
	return text
}
function notEmpty(value:string){
	return typeof value == "string" && value.length
}
export const git = {
	connectWithName(name:string){
		return GIT`config user.name ${name}`
	},
	connectWithEmail(email:string){
		return GIT`config user.email ${email}`
	},
	dir(dir:string){
		if(!notEmpty(dir))
			dir = "./"
		return $`cd ${dir}`
	},
	clone(url:string){
		if(!notEmpty(url))
			throw `URL is empty`
		return GIT`clone ${url}`
	},
	fetch:()=>GIT`fetch`,
	init:()=>GIT`init`,
	status:()=>GIT`status`,
	add:()=>GIT`add .`,
	commit(message:string){
		return GIT` commit -m "${JSON.stringify(message)}"`
	},
	log:()=>GIT`log`,
	diff:()=>GIT`diff`,
	branchs:()=>GIT`branch`,
	createBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`branch ${branch}`
	},
	changeBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`checkout ${branch}`
	},
	createAndChangeBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`checkout -b ${branch}`
	},
	deleteBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`branch -d ${branch}`
	},
	remote(url:string){
		if(!notEmpty(url))
			throw `url name is empty`
		return GIT`remote add origin ${url}`
	},
	pullRemoteBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`pull origin ${branch}`
	},
	pushRemoteBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`push origin ${branch}`
	},
	deleteRemoteBranch(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`push origin --delete ${branch}`
	},
	deleteFile(file:string){
		if(!notEmpty(file))
			throw `file name is empty`
		return GIT`rm ${file}`
	},
	merge(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`merge ${branch}`
	},
	rebase(branch:string){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT`rebase ${branch}`
	},
	backWithoutModifiaction:()=>GIT`reset --soft HEAD~1`,
	backAndDeleteModifiaction:()=>GIT`reset --hard HEAD~1`,
	stash:()=>GIT`stash`,
	pop:()=>GIT`stash pop`,
}