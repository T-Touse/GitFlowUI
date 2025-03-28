import { watch, FSWatcher } from "fs";
import { debounce } from "../utils";
import { PersistantSet } from "../Persistance";
import { Branch, RemoteBranch } from "./Branch";
import { git } from "./cmd";
import type { IBranch, IRemoteRepository, IRepository } from "./Igit";

abstract class AbstractRepository<T extends IBranch> implements IRepository<T> {
	#name:string=""
	get name(): string {
		return this.#name;
	}
	#readme:string =""
	get readme(): string {
		return this.#readme;
	}

	match(query: string): boolean {
		return this.name.includes(query) || this.readme.includes(query);
	}

	#currentBranch: IBranch;
	#branches: PersistantSet<T> = new PersistantSet<T>();
	#main: IBranch;
	#dir: string;
	#watcher: FSWatcher | null = null;

	get main(): T {
		return this.#main;
	}

	get dir(): string {
		return this.#dir;
	}

	constructor(dir: string) {
		this.#dir = dir;
		this.#main = new Branch(this, "main");
		this.#currentBranch = this.#main;
	}

	async branches(): Promise<T[]> {
		return this.#branches.values();
	}

	async createBranch(name: string): Promise<T> {
		throw new Error("Method not implemented.");
	}

	async deleteBranch(branch: IBranch): Promise<boolean> {
		branch.delete();
		return true;
	}

	isCurrent(branch: T): boolean {
		return this.#currentBranch === branch;
	}

	static async fromDir(dir: string): Promise<IRepository<IBranch>> {
		await git.dir(dir);
		await git.init();
		if(this != AbstractRepository)
			return new this(dir);
	}

	static async fromURL(url: string, dir: string): Promise<IRepository<IBranch>> {
		await git.dir(dir);
		await git.clone(url);
		return new this(dir);
	}

	open(): void {
		this.watch();
	}

	watch(): void {
		if (this.#watcher) return;
		const listener = debounce(() => this.#onFileModification());
		this.#watcher = watch(this.#dir, { recursive: true }, listener);
	}

	#onFileModification(): void {
		git.status();
	}
}

export class Repository extends AbstractRepository<Branch> {
	async createBranch(name: string): Promise<Branch> {
		await git.createBranch(name);
		return new Branch(this, name);
	}
}

export class RemoteRepository extends AbstractRepository<RemoteBranch> implements IRemoteRepository<RemoteBranch> {
	async createBranch(name: string): Promise<RemoteBranch> {
		await git.createBranch(name);
		return new RemoteBranch(this, name);
	}

	async fetch(): Promise<boolean> {
		return await git.fetch();
	}
}
