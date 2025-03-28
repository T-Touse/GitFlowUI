import { git } from "./cmd"
import type { IBranch, IGit, IRemoteBranch, IRepository } from "./Igit"
import { persistant, PersistantSet } from "../Persistance"


export class Git implements IGit{
	#repositories:PersistantSet<Repositor> = new PersistantSet;
	async init(dir: string): Promise<IRepository<IBranch>> {
		const repo = Repositor.fromDir(dir)
		this.#repositories.add(repo)
		return repo;
	}
	async clone(url: string,dir:string): Promise<IRepository<IBranch>> {
		const repo = Repositor.fromURL(url,dir)
		this.#repositories.add(repo)
		return repo
	}
	async repositories(query?: string): Promise<IRepository<IBranch>[]> {
		if(query)
			return this.#repositories.filter((t:Repositor)=>t.match(query))
		return this.#repositories.values()
	}
	static fromEmail(email:string){
		git.connectWithEmail(email)
	}
	static fromName(name:string){
		git.connectWithName(name)
	}
}