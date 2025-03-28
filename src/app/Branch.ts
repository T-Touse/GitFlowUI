import { ACTIONS } from "./Actions";

export interface IBranch{
	get name():string;
	delete():Promise<boolean>;
}
// Classe représentant une branche
export abstract class Branch implements IBranch{
	#name:string
	get name():string{return this.#name}
	constructor(name: string) {
		this.#name = name
	}

	delete(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
class LocalBranch extends Branch{
	async delete() {
		await ACTIONS.deleteBranch(this.name);
		return true;
	}
}
class RemoteBranch extends Branch{
	async delete() {
		await ACTIONS.deleteRemoteBranch(this.name)
		return true;
	}
}