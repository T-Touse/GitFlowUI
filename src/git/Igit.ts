export interface IBranch {
	get name(): string;
	commit(message: string): Promise<boolean>;
	merge(branch: IBranch): Promise<boolean>;
	checkout(): Promise<boolean>;
	delete(): Promise<boolean>;
	log(): Promise<string[]>;
	status(): Promise<Record<string, string>>;
}

// 🌎 Interface pour une branche distante
export interface IRemoteBranch extends IBranch {
	push(): Promise<boolean>;
	pull(): Promise<boolean>;
}

// 📦 Interface principale de gestion Git
export interface IRepository<B extends IBranch> {
	get name(): string;
	get main(): B;
	branches(): Promise<B[]>;
	createBranch(name: string): Promise<B>;
	deleteBranch(branch: B): Promise<boolean>;
	isCurrent(branch:B):boolean;
}
export interface IRemoteRepository<B extends IRemoteBranch> extends IRepository<B>{
	fetch(): Promise<boolean>;
}

export interface IGit{
	init(dir:string):Promise<IRepository<IBranch>>;
	clone(url:string,dir:string):Promise<IRepository<IBranch>>;
	repositories(query?:string):Promise<IRepository<IBranch>[]>;
}
