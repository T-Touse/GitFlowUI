export function debounce<T extends (...args: any[]) => void>(callback: T, delay = 1000): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => callback(...args), delay);
	};
}
export function throttle<T extends (...args: any[]) => void>(callback: T, delay = 1000): (...args: Parameters<T>) => void {
	let lastCall = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			callback(...args);
		}
	};
}
