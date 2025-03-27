const isElectron = window && window.process && window.process.type;
const win = isElectron ? window.require("electron").remote.getCurrentWindow() : null;
const NOOP = () => { }

export const minimize = win ? () => win.minimize() : NOOP
export const maximize = win ? () => {
	const isMaximized = win.isMaximized();
	if (isMaximized) {
		win.unmaximize();
	} else {
		win.maximize();
	}
	if(this)
		this(!isMaximized)
} : NOOP
export const close = win ? () => win.close() : NOOP