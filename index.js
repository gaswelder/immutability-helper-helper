const update = require("immutability-helper");

const steps = path => (path != "" ? path.split(".").reverse() : []);

const wrap = (obj, steps) => {
	if (steps.length == 0) return obj;
	return wrap({ [steps[0]]: obj }, steps.slice(1));
};

const _make = opcode => (path, opargs) =>
	wrap({ [opcode]: opargs }, steps(path));

const set = _make("$set");
const push = _make("$push");
const unshift = _make("$unshift");
const splice = (path, skip, num, ...vals) =>
	wrap({ $splice: [[skip, num, ...vals]] }, steps(path));
const apply = _make("$apply");
const merge = _make("$merge");
const toggle = _make("$toggle");
const unset = _make("$unset");
const remove = _make("$remove");
const add = _make("$add");

const op = (val, path = "") => ({
	set: newVal => update(val, set(path, newVal)),
	push: (...items) => update(val, push(path, items)),
	unshift: (...items) => update(val, unshift(path, items)),
	splice: (skip, num, ...vals) => update(val, splice(path, skip, num, ...vals)),
	apply: func => update(val, apply(path, func)),
	merge: diff => update(val, merge(path, diff)),
	toggle: (...fields) => update(val, toggle(path, fields)),
	unset: (...fields) => update(val, unset(path, fields)),
	remove: (...keys) => update(val, remove(path, keys)),
	add: (...items) => update(val, add(path, items))
});

module.exports = op;
