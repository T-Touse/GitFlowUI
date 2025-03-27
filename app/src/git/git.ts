const worker = new Worker("./git_worker.ts");

async function request<T = boolean>(cmd: string, data?: Record<string, any>): Promise<T> {
	return new Promise<T>((resolve) => {
		worker.postMessage({ cmd, data });
		const handler = (ev: MessageEvent) => {
			resolve(ev.data as T);
			worker.removeEventListener("message", handler);
		};
		worker.addEventListener("message", handler);
	});
}

export class Git {
	#main = new Branch("main");
	get main(): Branch {
		return this.#main;
	}
}

class Branch {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	async merge(branch: Branch): Promise<boolean> {
		return await request("merge", { branch: branch.name });
	}

	async commit(message: string): Promise<boolean> {
		return await request("commit", { message });
	}

	async branch(name: string): Promise<Branch> {
		const success = await request<boolean>("create_branch", { name });
		return success ? new Branch(name) : Promise.reject("Branch creation failed");
	}
}

class DistantBranch extends Branch {
	async push(): Promise<boolean> {
		return await request("push", { branch: this.name });
	}
}
