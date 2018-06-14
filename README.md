# immutability-helper-helper

This is a wrapper around `immutability-helper` - a library that helps to produce a mutated copy of data without changing the original source.

This wrapper exists because the original syntax is too messy. Mongo syntax was not a great example to begin with.

## Examples

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

### Multiple operations

```js
// Before:
const newData = update(myData, {
	x: { y: { z: { $set: 7 } } },
	a: { b: { $push: [9] } }
});

// After:
const newData = op(op(myData).set("x.y.z", 7)).push("a.b", 9);
```
