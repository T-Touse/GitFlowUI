function notEmpty(value:string){
	return typeof value == "string" && value.length
}
const GIT = "git "
const CMDS:Record<string,string|((...args:any[])=>string)> = {
	connect(user){
		let method = notEmpty(user.name)?"name":notEmpty(user.email)?"email":null;
		if(method == null)
			throw `any method has defnied for connection you cna chose between {name:"example"} and {email:"example@examlpe.com"}`
		const value = user[method]
		return GIT+`config user.${method} ${value}`
	},
	dir(dir){
		if(!notEmpty(dir))
			dir = "./"
		return `cd ${dir}`
	},
	clone(url){
		if(!notEmpty(url))
			throw `URL is empty`
		return GIT+`clone ${url}`
	},
	init:GIT+"init",
	status:GIT+"status",
	add:GIT+"add .",
	commit(message){
		return GIT+`commit -m "${JSON.stringify(message)}"`
	},
	log:GIT+"log",
	diff:GIT+"diff",
	branchs:GIT+"branch",
	createBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`branch ${branch}`
	},
	changeBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`checkout ${branch}`
	},
	createAndChangeBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`checkout -b ${branch}`
	},
	deleteBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`branch -d ${branch}`
	},
	remote(url){
		if(!notEmpty(url))
			throw `url name is empty`
		return GIT+`remote add origin ${url}`
	},
	pullRemoteBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`pull origin ${branch}`
	},
	pushRemoteBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`push origin ${branch}`
	},
	deleteRemoteBranch(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`push origin --delete ${branch}`
	},
	deleteFile(file){
		if(!notEmpty(file))
			throw `file name is empty`
		return GIT+`rm ${file}`
	},
	merge(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`merge ${branch}`
	},
	rebase(branch){
		if(!notEmpty(branch))
			throw `branch name is empty`
		return GIT+`rebase ${branch}`
	},
	backWithoutModifiaction:GIT+"reset --soft HEAD~1",
	backAndDeleteModifiaction:GIT+"reset --hard HEAD~1",
	stash:GIT+"stash",
	pop:GIT+"stash pop",
}