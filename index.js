(function (reactor) {
    if (typeof module !== "undefined") {
        let Slys;
        module.exports = reactor(Slys = {});
    }
})(function (Slys) {
    const format = Slys.format = function (string, ...args) {
        let Formatter = String;
        Object.assign(Formatter.prototype, {
            format,
            where (assignments) {
                if (typeof assignments !== "object") return this;

                Object.assign(this, {
                    [Symbol.toStringTag]: "FormatterBase"
                });

                return this.format(this, assignments);
            }
        });

        if (typeof this === "undefined" && typeof string === "undefined") {
            throw new Error("No string to format");
        }

        if (typeof this === "string" && ({}).toString.call(this) === "[object FormatterBase]") {
            args = [string, ...args],
            string = this;
        } else if (typeof this === "string") {
            args = [string, ...args],
            string = new Formatter(this);
        }

        let i = 0, assignment = {};

        if (({}).toString.call(string) === "[object FormatterBase]") {
            let reference = args[0];
            args = args.slice(1);

            for (let key in reference) {
                if (/\d/.test(key) || Object(null)[key]) {
                    continue;
                } else {
                    assignment[key] = reference[key];
                }
            }
        }

        string = string.replace(/{{?([\d\w]+?)?(\.[\.\w\d]+?)?(:.*[<^>]\d+?)?(![rsw](.+?)?)?}}?/g, function (match, index, properties, align, rsw, quot) {
            if (/^{{|}}$/g.test(match)) {
                return match.slice(1, -1);
            }
            
            let val = (i => (/\d/.test(i) ? args : assignment)[i])(index || i);

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
                val = `[${/class \w+(?: extends \w+)?/.exec((!val.constructor.toString().startsWith("function Function") ? val.constructor : val.prototype.constructor || val) + "")[0]}]`
            } else if (isFunction(val)) {
                val = `[${/function\*? \w+/.exec((val.constructor || val.prototype.constructor || val) + "")[0]}]`
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

                align = filler.repeat(Slys.range(space).length).split("");

                let shards = val.split(/\r?\n|\r/g),
                    vals = [];

                for (let shard of shards) {
                    switch (alignment) {
                        case "<":
                            {
                                let _align = align.slice(0, `-${shard.length - 1}`);
                                _align = [...shard.split(""), ..._align];

                                vals.push(_align.join(""));
                            };
                            break;
                        case "^":
                            {
                                let _align = align.slice(0, `-${shard.length}`);

                                let left = _align.slice(Math.floor(_align.length / 2));

                                _align = [...left, ...shard.split(""), ...(((left.length) * 2) + shard.length === space ? [...left, filler] : left)];

                                vals.push(_align.join(""));
                            };
                            break;
                        case ">":
                            {
                                let _align = align.slice(0, `-${shard.length - 1}`);
                                _align.push(...shard.split(""));

                                vals.push(_align.join(""));
                            };
                            break;
                    }
                }

                val = vals.join("\n");
            }

            if (rsw) {
                switch(rsw.slice(1, 2)) {
                    case "r": {
                        let left, right;

                        if (quot && quot === "<>") {
                            [left, right] = quot;
                        } else if (quot) {
                            [left, right] = [quot, quot];
                        } else {
                            [left, right] = "\"".repeat(2);
                        }

                        val = [left, ...val.split(""), right].join("");
                    }; break;
                    case "s": {
                        val = val;
                    }; break;
                    case "w": {
                        let wrap = rsw.slice(2).split(/\s*\|\s*/).slice(0, 2);

                        val = [wrap[0], ...val.split(" "), wrap[wrap.length - 1]].join("");
                    }
                }
            }

            return val;
        });
        
        return string;
    }

    Slys.range = function (start, end = start, step = /-/.test(end) ? -1 : 1) {
        if (Number.isSafeInteger(start) || Number.isSafeInteger(end) || Number.isSafeInteger(step)) {
            let arr = [];

            if (step === 0) {
                throw new Error(Slys.format("{!r'} must not be {!r'}.", "step", "0"));
            }

            if (end === start) {
                start = 0;
            }

            if (/-/.test(step) !== /-/.test(end)) {
                return arr;
            }

            for (let current = start;
                /-/.test(end) ? current > end : current < end; current = current + step) {
                arr.push(current);
            }

            return arr;
        } else {
            throw new Error("{.0}, {.1!r'}, and/or {.2!r'} are unsafe.", [ "start", "end", "step" ]);
        }
    }

    const isClass = (obj) => {
        if (obj && obj.toString && /^class/.test(obj.toString())) {
            return true;
        }
        if (obj && obj.constructor && obj.constructor.toString && /^class/.test(obj.constructor.toString())) {
            return true;
        } else if (obj && obj.prototype && obj.prototype.constructor && obj.prototype.constructor.toString && /^class/.test(obj.prototype.constructor.toString())) {
            return true;
        } else {
            return false;
        }
    }

    const isFunction = (func) => {
        return typeof func === "function";
    }

    return Slys;
});