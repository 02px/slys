(function (Reactor) {
    if (typeof module !== "undefined") {
        module.exports = new Reactor();
    } else if (typeof self !== "undefined") {
        self.this = new Reactor();
    }
})(function () {
    const version = this.version = "1.0.3";

    const Formatter = this.Formatter = String;
    Object.assign(Formatter.prototype, {
        format(string, ...args) {
            if (typeof string === "undefined" || typeof this === "undefined") {
                const err = new Error("No string to format");
                throw err;
            }

            if (this instanceof String && ({}).toString.call(this) === "[object <FormatterBase>]") {
                args = [string, ...args],
                    string = this;
            } else if (this instanceof String && ({}).toString.call(this) === "[object String]") {
                args = [string, ...args],
                    string = new Formatter(this);
            }

            let i = 0,
                assignment = {};

            if (({}).toString.call(string) === "[object <FormatterBase>]") {
                let reference = args[0];
                args = args.slice(1);

                for (let key in reference) {
                    if (/^\d+$/g.test(key) || Object(null)[key]) {
                        continue;
                    } else {
                        assignment[key] = reference[key];
                    }
                }

                Object.assign(this, {
                    [Symbol.toStringTag]: "String"
                });
            }

            string = string.replace(/{{?([\d\w]+?)?(\.[.\w\d]+?)?(:.*[<^>]\d+?)?(![rsw](.+?)?)?}}?/g, function (match, index, properties, align, rsw, quot) {
                if (/^{{|}}$/g.test(match)) {
                    return match.slice(1, -1);
                }

                let val = (i => (/^\d+$/g.test(i) ? args : assignment)[i])(index || i);

                if (!index) {
                    i++;
                }

                if (typeof val === "undefined") {
                    return match;
                }

                if (properties) {
                    properties = properties.slice(1).split(".");

                    if (properties.length > 0) {
                        for (let property of properties) {
                            val = val[property];
                        }
                    }
                }

                if (typeof val === "undefined") {
                    return match;
                }

                if (isClass(val)) {
                    val = `[${/class \w+(?: extends \w+)?/.exec((!(val.constructor + "").startsWith("function Function") ? val.constructor : val.prototype.constructor || val) + "")[0]}]`;
                } else if (isFunction(val)) {
                    val = `[${/function\*? \w+/.exec((val.constructor || val.prototype.constructor || val) + "")[0]}]`;
                } else if (Array.isArray(val)) {
                    val = `[Array ${val.length}]`;
                } else {
                    val = val + "";
                }

                if (align) {
                    align = align.slice(1);

                    let
                        filler = /(.*?)[<^>]\d+$/g.exec(align)[1],
                        alignment = /.*?([<^>])\d+$/g.exec(align)[1],
                        space = /.*?[<^>](\d+)$/g.exec(align)[1] - 1;

                    if (!filler) {
                        filler = " ";
                    } else {
                        filler = filler.charAt(0);
                    }

                    align = filler.repeat(range(space).length).split("");

                    let shards = val.split(/\r?\n|\r/g),
                        vals = [];

                    for (let shard of shards) {
                        switch (alignment) {
                            case "<":
                                {
                                    let _align = align.slice(0, -(shard.length - 1));
                                    _align = [...shard.split(""), ..._align];

                                    vals.push(_align.join(""));
                                }
                                break;
                            case "^":
                                {
                                    let _align = align.slice(0, -shard.length);

                                    let left = _align.slice(Math.floor(_align.length / 2));

                                    _align = [...left, ...shard.split(""), ...(((left.length) * 2) + shard.length === space ? [...left, filler] : left)];

                                    vals.push(_align.join(""));
                                }
                                break;
                            case ">":
                                {
                                    let _align = align.slice(0, -(shard.length - 1));
                                    _align.push(...shard.split(""));

                                    vals.push(_align.join(""));
                                }
                                break;
                        }
                    }

                    val = vals.join("\n");
                }

                if (rsw) {
                    switch (rsw.slice(1, 2)) {
                        case "r":
                            {
                                let left, right;

                                if (quot && quot === "<>") {
                                    [left, right] = quot;
                                } else if (quot && ['"', "'", "`"].includes(quot)) {
                                    [left, right] = quot.repeat(2);
                                } else {
                                    [left, right] = "\"".repeat(2);
                                }

                                val = [left, ...val.split(""), right].join("");
                            }
                            break;
                        case "s": break;
                        case "w":
                            {
                                let wrap = rsw.slice(2).split(/\s*\|\s*/).slice(0, 2);

                                val = [wrap[0], ...val.split(" "), wrap[wrap.length - 1]].join("");
                            }
                    }
                }

                return val;
            });

            return string;
        },
        where(assignments) {
            if (typeof assignments !== "object") return this;

            Object.assign(this, {
                [Symbol.toStringTag]: "<FormatterBase>"
            });

            return this.format.call(this, assignments);
        }
    });

    const all = this.all = function (iterable, boolean = true) {
        if (typeof iterable !== "object") {
            const err = new TypeError(this.format("{!r'} is not iterable.", typeof iterable));
            throw err;
        } else {
            if (typeof iterable === "undefined") {
                iterable = {};
            }

            boolean = Boolean(boolean);

            for (element in iterable) {
                if (Boolean(iterable[element]) !== boolean) {
                    return false;
                }
            }

            return true;
        }
    };

    const any = this.any = function (iterable = [], boolean = true) {
        let err;
        if (typeof iterable !== "object") {
            err = new Error(this.format("{!r'} is not iterable.", typeof iterable));
            throw err;
        } else {
            boolean = Boolean(boolean);

            for (element in iterable) {
                if (Boolean(iterable[element]) === boolean) {
                    return true;
                }
            }

            return false;
        }
    };

    this.yield = "";

    const chunk = this.chunk = function (iterable = [], count = 1, exclude = false) {
        const 
            { floor, abs } = Math,
            { entries, values } = Object;

        if ([ "object", "string" ].includes(typeof iterable)) {
            if (entries(iterable).length === 0) return [];

            let i = 0, list = [];
            
            if (count === 0) return list;

            count = floor(abs(count));

            while (i < entries(iterable).length) {
                let items = entries(iterable).splice(i, count);

                // make sure to push an object if `typeof iterable` is `"object"`
                if (!Array.isArray(iterable) && typeof iterable === "object") {
                    let reference = items;
                    items = {};
                    reference.map(item => {
                        return items[item[0]] = item[1];
                    });
                } else if (Array.isArray(iterable)) {
                    items = items.map(item => item[1]);
                } else {
                    items = items.map(item => item[1]).join("");
                }

                if ((values(items).length === 0) || (values(items).length !== count && exclude === true)) {
                    break;
                }

                list.push(items);
                i += values(items).length;
            }

            return list;
        } else {
            return [];
        }
    };

    const { format } = { format: this.format } = Formatter.prototype;

    const range = this.range = function (start, end = start, step = /-/.test(end) ? -1 : 1) {
        let arr = [];

        if (isNaN(start + end + step) || step === 0 || /-/.test(step) !== /-/.test(end)) return arr;

        if (end === start) {
            start = 0;
        }

        for (let current = start;
            /-/.test(end) ? current > end : current < end; current = current + step) {
            arr.push(current);
        }

        return arr;
    };

    const zip = this.zip = function (...iterable) {
        let list = [],
            level = 0;

        iterable = iterable.filter((iter) => typeof iter === "object");

        if (iterable.length !== 0) {
            for (el in iterable[0]) list.push([]);

            for (let i = 0; i <= Object.keys(iterable[0]).length; i++) {
                if (typeof list[i] === "undefined") continue;
                for (let it in iterable) {
                    if (typeof iterable[it][level] !== "undefined") {
                        list[i].push(iterable[it][level]);
                    }
                }
                level++;
            }
        }

        return list = list.filter((element, _, arr) => {
            if (Object.keys(element).length !== Object.keys(arr[0]).length) {
                return false;
            } else {
                return true;
            }
        });
    };

    const isClass = (obj) => {
        if (obj && obj.toString && /^class/.test(obj + "")) {
            return true;
        }
        if (obj && obj.constructor && obj.constructor.toString && /^class/.test(obj.constructor + "")) {
            return true;
        } else if (obj && obj.prototype && obj.prototype.constructor && obj.prototype.constructor.toString && /^class/.test(obj.prototype.constructor + "")) {
            return true;
        } else {
            return false;
        }
    };

    const isFunction = (func) => {
        return typeof func === "function";
    };

    return this;
});