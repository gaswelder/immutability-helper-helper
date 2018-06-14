const update = require("immutability-helper");

const steps = path => (path != "" ? path.split(".").reverse() : []);

const wrap = (obj, steps) => {
	if (steps.length == 0) return obj;
	return wrap({ [steps[0]]: obj }, steps.slice(1));
};

const set = (path, val) => wrap({ $set: val }, steps(path));
const push = (path, val) => wrap({ $push: [val] }, steps(path));
const unshift = (path, val) => wrap({ $unshift: [val] }, steps(path));
const splice = (path, skip, num, ...vals) =>
	wrap({ $splice: [[skip, num, ...vals]] }, steps(path));
const apply = (path, func) => wrap({ $apply: func }, steps(path));
const merge = (path, diff) => wrap({ $merge: diff }, steps(path));
const toggle = (path, fields) => wrap({ $toggle: fields }, steps(path));
const unset = (path, fields) => wrap({ $unset: fields }, steps(path));
const remove = (path, keys) => wrap({ $remove: keys }, steps(path));
const add = (path, items) => wrap({ $add: items }, steps(path));

const op = (val, path = "") => ({
	set: newVal => update(val, set(path, newVal)),
	push: newVal => update(val, push(path, newVal)),
	unshift: newVal => update(val, unshift(path, newVal)),
	splice: (skip, num, ...vals) => update(val, splice(path, skip, num, ...vals)),
	apply: func => update(val, apply(path, func)),
	merge: diff => update(val, merge(path, diff)),
	toggle: (...fields) => update(val, toggle(path, fields)),
	unset: (...fields) => update(val, unset(path, fields)),
	remove: (...keys) => update(val, remove(path, keys)),
	add: (...items) => update(val, add(path, items))
});

module.exports = op;
