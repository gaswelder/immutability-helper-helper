# immutability-helper-helper

This is a wrapper around [`immutability-helper`](https://github.com/kolodny/immutability-helper) - a library that helps to produce a mutated copy of data without changing the original source. This wrapper exists because the original syntax is too messy.

## Examples

Examples below show how the same operation would be done using immutability-helper directly, and then using this wrapper.

### Simple push

```js
const initialArray = [1, 2, 3];

// Before:
const newArray = update(initialArray, { $push: [4] }); // => [1, 2, 3, 4]

// After:
const newArray = op(initialArray).push(4); // => [1, 2, 3, 4]
```

### Nested collections

```js
const collection = [1, 2, {a: [12, 17, 15]}];

// Before:
const newCollection = update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
// => [1, 2, {a: [12, 13, 14, 15]}]

// After:
const newCollection = op(collection, '2.a').splice([1, 1, 13, 14]])
```

### Setting via callback

```js
const obj = { a: 5, b: 3 };

// Before:
const newObj = update(obj, { b: { $apply: x => x * 2 } }); // => {a: 5, b: 6}

// After:
const newObj = op(obj, "b").apply(x => x * 2); // => {a: 5, b: 6}
```

### Merge

```js
const obj = { a: 5, b: 3 };

// Before:
const newObj = update(obj, { $merge: { b: 6, c: 7 } }); // => {a: 5, b: 6, c: 7}

// After:
const newObj = op(obj).merge({ b: 6, c: 7 }); // => {a: 5, b: 6, c: 7}
```

### Computed paths

```js
const collection = { children: ["zero", "one", "two"] };
const index = 1;

// Before:
const newCollection = update(collection, {
	children: { [index]: { $set: 1 } }
});
// => {children: ['zero', 1, 'two']}

// After:
const newCollection = op(collection, `children.${index}`).set(1);
// => {children: ['zero', 1, 'two']}
```

### Batch operations

```js
// Before:
const newData = update(myData, {
	x: { y: { z: { $set: 7 } } },
	a: { b: { $push: [9] } }
});

// After:
const newData = op(myData)
	.begin()
	.set("x.y.z", 7)
	.push("a.b", 9)
	.end();
```

For batch operations, path given to the `op` will be used as a common path prefix.

```js
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

// Before:
const altered = update(original, {
	c: {
		d: { $set: "m" },
		f: { $push: [5] },
		g: { $unshift: [6] },
		h: { $splice: [[0, 1, 7]] },
		i: { $merge: { n: "o" } },
		l: { $apply: x => x * 2 },
		m: x => x + x
	}
});

// After:
const altered = op(original, "c")
	.begin()
	.set("d", "m")
	.push("f", 5)
	.unshift("g", 6)
	.splice("h", 0, 1, 7)
	.merge("i", { n: "o" })
	.apply("l", x => x * 2)
	.apply("m", x => x + x)
	.end();
```
