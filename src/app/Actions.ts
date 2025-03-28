import type { IBranch } from "./Branch";

let GIT_DIR:string;
const GIT = (strings: TemplateStringsArray, ...value: any[]) => ""

export const ACTIONS = {
	setDir(dir:string){
		GIT_DIR = dir;
	},
	async init(){
		GIT`init`
	},
	clone(url:string){
		GIT`clone ${url}`
	},
	async listModifiedFiles():Promise<string[]>{
		const matches = ((await GIT`status -s`).matchAll(/\w\s(.*)/g) || []);
		const ls:string[] = []
		if(matches)
			matches.forEach(([_,file])=>file && ls.push(file))
		return ls
	},
	async add(file:string){
		return GIT`add ${file}`
	},
	async commit(message:any){
		GIT`commit -m "${JSON.stringify(message)}"`
	},
	async merge(branch:string,onBranch?:string|null){
		if(branch == onBranch)
			onBranch = await GIT`rev-parse --abbrev-ref HEAD`
		if(branch == onBranch)
			onBranch = null;
		if(onBranch){
			const onBranchId = await GIT`merge-base ${branch} ${onBranch}`
			let branchId = await GIT`git rev-parse --verify ${branch}`
			if(branchId == onBranchId)
				branchId = onBranch
		}else{
			const log:string|null = ((await GIT`reflog show HEAD`)||"").split("\n").find(x=>x.includes(`to ${branch}`))||null
			if(log){
				const matches = log.match(/\(origin\/.+?, (.+?)\)/)
				if(matches)
					if(matches[0])
						onBranch = matches[0][1]
			}
		}
		console.log(onBranch)
	},
	async getRemoteBranches():Promise<string[]>{
		return ((await GIT`branch -r`)||"").replace(/origin\/HEAD -> .+ \n/,"").split('\n')
	},
	async selectBranch(branch:IBranch){
		return GIT`checkout "${branch.name}"`
	},
	async deleteBranch(name:string){
		return GIT`branch -d ${name}`
	},
	async deleteRemoteBranch(name:string){
		return GIT`push origin --delete ${name}`
	}
}