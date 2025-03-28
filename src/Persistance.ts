export interface IPersistantSet<T> {
	add(item: T): void;
	delete(item: T): void;
	filter(filtering: (t: T) => boolean, sorter?: (a: T, b: T) => number, limit?: number): T[];
	values(): T[];
	get size(): number
}
export class PersistantSet<T> implements IPersistantSet<T> {
	#local: Set<T> = new Set;
	add(item: T): void {
		this.#local.add(item);
	}
	delete(item: T): void {
		this.#local.delete(item);
	}
	filter(filtering: (t: T) => boolean, sorter?: (a: T, b: T) => number, limit?: number): T[] {
		let results = this.values().filter(filtering);
		if (sorter) results.sort(sorter);
		if (limit !== undefined) results = results.slice(0, limit);
		return results;
	}
	values(): T[] {
		return [...this.#local.values()];
	}
	get size(): number {
		return this.#local.size
	}
}

export function persistant<T>(name: string, db?: string) {
	return function (target: any, context: ClassFieldDecoratorContext) {
		const storageKey = `${db || "defaultDB"}:${name}`;

		return function (initialValue?: PersistantSet<T>) {
			const instance = new PersistantSet<T>();

			return instance;
		};
	};
}
