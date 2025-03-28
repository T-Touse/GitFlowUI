import { watch, type FSWatcher, type WatchEventType, type WatchListener } from "fs";
import { debounce } from "../utils";
import type { IBranch } from "./Branch";
import { ACTIONS } from "./Actions";
/**
 * Repository permet de : 
 * - "watch(dir)" les fichiers du repertoire
 * - "commit" tous ou que certain fichier avec ou sans message
 * 
 */

export interface IRepository{
	open():Promise<boolean>;
	close():Promise<boolean>;
	get modifiedFiles():string[];
	createCommit(branch: IBranch, files: Array<string>, message?: string):Promise<boolean>;
}

export abstract class Repository implements IRepository{
	#dir
	constructor(dir: string) {
		this.#dir = dir

	}
	async open() {
		this.watch();
		await this.status()
		return true
	}
	async close() {
		if (this.#watcher) {
			this.#watcher.close()
		}
		return true
	}
	protected async status() {
		const changes:string[] = await ACTIONS.listModifiedFiles();
		changes.forEach((file) => {
			if (file)
				this.#modified.add(file);
		})
	}
	#watcher: FSWatcher | null = null;
	protected watch() {
		if (this.#watcher) return;
		const listener: WatchListener<string> = debounce((e, file) => this.#onFileModification(e, file));
		this.#watcher = watch(this.#dir, { recursive: true }, listener);
	}
	#modified: Set<string> = new Set();
	#onFileModification(e: WatchEventType, file: string): void {
		this.#modified.add(file);
	}
	get modifiedFiles(): string[] {
		return [...this.#modified];
	}
	async createCommit(branch: IBranch, files: Array<string> = [], message?: string) {
		if (!files.length)
			files = this.modifiedFiles
		if (!files.length) return false
		if(!message)
			message = files.join(',')
		await ACTIONS.selectBranch(branch)
		const pls: any[] = []
		files.forEach(file => {
			pls.push(ACTIONS.add(file))
			this.#modified.delete(file)
		})
		await Promise.all(pls)
		await ACTIONS.commit(message)
		return true
	}
	async merge(branch: IBranch,onBranch?: IBranch){
		await ACTIONS.merge(branch.name,onBranch?.name)
	}

	static async open(dir: string):Promise<Repository>{
		ACTIONS.setDir(dir)
		const remotes = await ACTIONS.getRemoteBranches()
		if(remotes.length){
			return new RemoteRepository(dir)
		}
		return new LocalRepository(dir)
	}
	static async create(dir: string):Promise<Repository> {
		ACTIONS.setDir(dir)
		await ACTIONS.init()
		return new LocalRepository(dir)
	}
	static async clone(url: string, dir: string):Promise<Repository> {
		ACTIONS.setDir(dir)
		await ACTIONS.clone(url)
		return new RemoteRepository(dir)
	}
}
// Implémentation pour les dépôts locaux
class LocalRepository extends Repository {
	constructor(dir: string) {
		super(dir);
	}
}

// Implémentation pour les dépôts distants (ex: GitHub, GitLab)
class RemoteRepository extends Repository {
	constructor(dir: string) {
		super(dir);
	}

	async fetch() {
		return ;
	}

	async pull() {
		return ;
	}

	async push() {
		return ;
	}
}