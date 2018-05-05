# Slys
> Let utilities come to you.
# API
## `.format (string[, ...args])`
> Similar to Python's `str.format`.

Takes a format string and a set of positional arguments and returns the formatted result. Returns [`Formatter`](#formatter).

Format strings contain `replacement fields`, wrapped by curly braces `{}`.  Anything outside braces are considered literal text, which is cloned to the result. If you need to include a brace character in the literal text, it can be escaped by doubling (`{{}}` is being `{}` in the result). If using [`Formatter.where`](#where-assignments), triple the braces, because [`Formatter.format`](#format-string-args-1) is called.

```js
> slys.format("{0}, {1}, {2}", "a", "b", "c");
"a, b, c"
> slys.format("{}, {}, {}", "a", "b", "c");
"a, b, c"
> slys.format("{2}, {1}, {0}", "a", "b", "c");
"c, b, a"
> slys.format("{0}{1}{0}", "abra", "cad"); // arguments' indices can be repeated
"abracadabra"
> slys.format("{foo}").where({ "foo": "bar" }));
"bar"
```

You can also extend [`String.prototype`](https://developer.mozilla.org/docs/Web/JavaScript/Referencia/Objetos_globales/String/prototype).
```js
> String.prototype.format = slys.format;
// ...
> "{0}{1}{0}".format("abra", "cad");
"abracadabra"
```

## `.range(start[, end[, step]])`

> Similar to Python's built-in function `range`.

Creates a list containing mathematics progressions. The arguments must be plain and safe integer (see [`Number.isSafeInteger`](https://developer.mozilla.org/docs/Web/JavaScript/Referencia/Objetos_globales/Number/isSafeInteger)). If `step` is `undefined` it defaults to `1`, and if `start` is `undefined` it defaults to `0`. It returns an array of plain integers, decreasing or increasing `step` until the last element is the largest less than `stop` if positive or the smallest greater than `stop` if negative. If `end` is `undefined` `start` is assigned to `end` and `start` defaults to `0`. `step` must not be `0` or else `Error` is thrown.

```js
> slys.range(10);
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
> slys.range(1, 11);
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
> slys.range(0, 30, 5);
[ 0, 5, 10, 15, 20, 25 ]
> slys.range(0, -10, -1);
[ 0, -1, -2, -3, -4, -5, -6, -7, -8, -9 ]
> slys.range(0);
[]
> slys.range(1, 0);
[]
```

---

# Specifications

## `Formatter`
The `Formatter` class has the following methods:

### `.format (string[, ...args])`
The primary method. Takes a format string and a set of positional arguments and returns the formatted result. It returns a new formatted `Formatter`.
### `.where (assignments)`
Takes an object, which one is accessed while calling `Formatter.format` and returns a new formatted `Formatter`. The `replacement fields`' index can now be any key in the object.