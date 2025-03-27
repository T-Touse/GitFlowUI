export interface IBranch {
	name: string;
	commit(message: string): Promise<boolean>;
	merge(branch: IBranch): Promise<boolean>;
	checkout(): Promise<boolean>;
	delete(): Promise<boolean>;
	log(): Promise<string[]>;
	status(): Promise<Record<string, string>>;
}

// 🌎 Interface pour une branche distante
export interface IDistantBranch extends IBranch {
	push(): Promise<boolean>;
	pull(): Promise<boolean>;
	fetch(): Promise<boolean>;
}

// 📦 Interface principale de gestion Git
export interface IRepository {
	main: IBranch;
	branches(): Promise<IBranch[]>;
	createBranch(name: string): Promise<IBranch>;
	deleteBranch(name: string): Promise<boolean>;
	remoteBranches(): Promise<IDistantBranch[]>;
}

export interface IGit{
	init(dir:string):Promise<IRepository>;
	clone(url:string):Promise<IRepository>;
	repositories(query?:string):Promise<IRepository[]>;
}
