const assert = require("assert");
const op = require(".");
const it = global.it;

const cmp = (a, b) => {
	//console.log(a);
	//console.log(b);
	assert.deepStrictEqual(a, b);
};

it("whatever", function() {
	const state1 = ["x"];
	const state2 = op(state1).push("y");
	cmp(state1, ["x"]);
	cmp(state2, ["x", "y"]);

	const collection = [1, 2, { a: [12, 17, 15] }];
	const newCollection = op(collection, "2.a").splice(1, 1, 13, 14);
	cmp(collection, [1, 2, { a: [12, 17, 15] }]);
	cmp(newCollection, [1, 2, { a: [12, 13, 14, 15] }]);

	const myData = { x: { y: { z: 0 } }, q: 0 };
	const newData = op(myData, "x.y.z").set(7);
	cmp(myData, { x: { y: { z: 0 } }, q: 0 });
	cmp(newData, { x: { y: { z: 7 } }, q: 0 });

	const obj = { a: 5, b: 3 };
	const newObj = op(obj).merge({ b: 6, c: 7 });
	cmp(obj, { a: 5, b: 3 });
	cmp(newObj, { a: 5, b: 6, c: 7 });

	const twice = op(obj, "b").apply(x => x * 2);
	cmp(obj, { a: 5, b: 3 });
	cmp(twice, { a: 5, b: 6 });
});

it("pushes", function() {
	cmp(op([1]).push(7), [1, 7]);
});

it("unshifts", function() {
	cmp(op([1]).unshift(7), [7, 1]);
});
it("does not mutate the original object", function() {
	const obj = [1];
	op(obj).unshift(7);
	cmp(obj, [1]);
});

it("splices", function() {
	cmp(op([1, 4, 3]).splice(1, 1, 2), [1, 2, 3]);
});

it("merges", function() {
	cmp(op({ a: "b" }).merge({ c: "d" }), {
		a: "b",
		c: "d"
	});
});

it("setting a property to undefined should add an enumerable key to final object with value undefined", function() {
	const original = { a: 1 };
	const result = op(original, "b").set(undefined);
	cmp(Object.keys(original).length, 1);
	cmp(Object.keys(result).length, 2);
	cmp(result, { a: 1, b: undefined });
});

it("toggles false to true and true to false", function() {
	cmp(op({ a: false, b: true }).toggle("a", "b"), {
		a: true,
		b: false
	});
});

it("unsets", function() {
	const orig = { a: "b" };
	const removed = op(orig).unset("a");
	cmp(removed.a, undefined);
	cmp("a" in removed, false);
});

it("removes multiple keys from the object", function() {
	const original = { a: "b", c: "d", e: "f" };
	const removed = op(original).unset("a", "e");
	cmp("a" in removed, false);
	cmp("a" in original, true);
	cmp("e" in removed, false);
	cmp("e" in original, true);
});

it("works on Map", function() {
	const state = new Map([[1, 2], [3, 4]]);
	const state2 = op(state).add([5, 6]);
	cmp(state2.get(1), 2);
	cmp(state2.get(5), 6);
});

it("works on Map", function() {
	const state = new Map([[1, 2], [3, 4], [5, 6]]);
	const state2 = op(state).remove(1, 5);
	cmp(state2.has(1), false);
	cmp(state2.has(3), true);
	cmp(state2.get(3), 4);
	cmp(state2.has(6), false);
});

it("works on Set", function() {
	const state = new Set([1, 2, 3, 4]);
	const state2 = op(state).add(5, 6);
	cmp(state2.has(1), true);
	cmp(state2.has(5), true);
});

it("works on Set", function() {
	var state = new Set([1, 2, 3, 4]);
	var state2 = op(state).remove(2, 3);
	cmp(state2.has(1), true);
	cmp(state2.has(2), false);
});

it("should accept array spec to modify arrays", function() {
	const original = { value: [{ a: 0 }] };
	const modified = op(original, "value.0.a").set(1);
	cmp(modified, { value: [{ a: 1 }] });
});

it("should accept object spec to modify arrays", function() {
	var original = { value: [{ a: 0 }] };
	var modified = op(original, "value.0.a").set(1);
	cmp(modified, { value: [{ a: 1 }] });
});

it("deep update", function() {
	const original = {
		a: "b",
		c: {
			d: "e",
			f: [1],
			g: [2],
			h: [3],
			i: { j: "k" },
			l: 4,
			m: "n"
		}
	};

	const ops = {
		c: {
			d: { $set: "m" },
			f: { $push: [5] },
			g: { $unshift: [6] },
			h: { $splice: [[0, 1, 7]] },
			i: { $merge: { n: "o" } },
			l: {
				$apply: function(x) {
					return x * 2;
				}
			},
			m: function(x) {
				return x + x;
			}
		}
	};

	const result = {
		a: "b",
		c: {
			d: "m",
			f: [1, 5],
			g: [6, 2],
			h: [7],
			i: { j: "k", n: "o" },
			l: 8,
			m: "nn"
		}
	};

	//cmp(update(original, ops), result);
});
