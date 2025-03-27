function match(target, element) {
	return target.matches(element);
}

const EVENTS = {};
export function event(element, eventType, callback) {
	if (!EVENTS[eventType]) {
		EVENTS[eventType] = [];
		document.addEventListener(eventType, (event) => {
			EVENTS[eventType].forEach(listener => {
				if (!match(event.target, listener.element)) return;
				try {
					listener.callback.call(event.target, event);
				} catch (err) {
					console.error(err);
				}
			});
		});
	}
	EVENTS[eventType].push({ element, callback });
}

let STYLE;
export function style(element, rule) {
	if (!STYLE) {
		STYLE = document.createElement('style');
		document.head.appendChild(STYLE);
	}
	const rules = [];
	Object.keys(rule).forEach(prop => {
		const value = rule[prop];
		if (prop.startsWith("@media")) {
			const mediaQuery = prop;
			const nestedRules = Object.keys(value)
				.map(nestedProp => `${nestedProp}:${value[nestedProp]}`)
				.join("; ");
			STYLE.textContent += `${mediaQuery} { ${element} { ${nestedRules} } }`;
			return;
		}
		if (typeof value === "object") {
			style(`${element} ${prop}`, value);
			return;
		}
		if (typeof value === "string" || typeof value === "number") {
			rules.push(`${prop}:${value}`);
		}
	});
	STYLE.textContent += `${element}{${rules.join(';')}}`;
}

const PROPS = {};
function PROPS_PROXY(self) {
	if (!self.__props__) self.__props__ = {};
	return new Proxy(self.__props__, {
		get(_, key) {
			if (_[key]) return _[key];
			if (PROPS[key]) {
				const propDef = PROPS[key].find(x => match(self, x.element));
				_[key] = propDef?.descriptor?.value ?? propDef?.descriptor?.get?.call(self);
				return _[key];
			}
		},
		set(_, key, value) {
			if (PROPS[key]) {
				const propDef = PROPS[key].find(x => match(self, x.element));
				propDef?.descriptor?.set?.call(self, value);
				return true;
			}
			_[key] = value;
			return true;
		}
	});
}
Object.defineProperty(HTMLElement.prototype, "prop", {
	get() {
		return PROPS_PROXY(this);
	}
});

export function prop(element, propName, descriptor) {
	if (!PROPS[propName]) {
		PROPS[propName] = [];
	}
	PROPS[propName].push({ element, descriptor });
}

const COMPONENTS = new Map();
export function component(element, component = {}) {
	component = Object.assign({}, component, ...((component.extends || []).map(comp => COMPONENTS.get(comp) || {})));
	const { events = {}, props = {}, styles = {} } = component;

	Object.keys(events).forEach(ev => event(element, ev, events[ev]));
	style(element, styles);
	Object.keys(props).forEach(propName => prop(element, propName, props[propName]));

	COMPONENTS.set(element, component);
}
