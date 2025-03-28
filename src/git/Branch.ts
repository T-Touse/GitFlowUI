import { git } from "./cmd";
import type { IBranch, IRemoteBranch, IRepository } from "./Igit";

export class Branch implements IBranch{
	#repo:IRepository<IBranch>;
	#name
	get name(){
		return this.#name
	}
	constructor(repo:IRepository<IBranch>,name:string){
		this.#repo = repo
		this.#name = name
	}
	async commit(message:string):Promise<boolean>{
		this.checkout()
		git.commit(message)
		return true;
	}
	async merge(branch:IBranch):Promise<boolean>{
		this.checkout()
		git.merge(branch.name)
		return true;
	}
	async checkout(): Promise<boolean> {
		if(! this.#repo.isCurrent(this))
			git.changeBranch(this.name)
		return true;
	}
	async delete(): Promise<boolean> {
		git.deleteBranch(this.name)
		return true;
	}
	async log(): Promise<string[]> {
		throw new Error("Method not implemented.");
	}
	async status(): Promise<Record<string, string>> {
		const str = await git.status();
		console.log(str)
		return {}
	}

}
export class RemoteBranch extends Branch implements IRemoteBranch,IBranch{
	async delete():Promise<boolean>{
		git.deleteRemoteBranch(this.name)
		return true;
	}
	async push():Promise<boolean>{
		this.checkout()
		git.pushRemoteBranch(this.name)
		return true;
	}
	async pull(): Promise<boolean> {
		this.checkout()
		git.pullRemoteBranch(this.name)
		return true;
	}
}
