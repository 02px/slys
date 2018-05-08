declare module "slys" {
    interface Formatter extends String {
        /**
         * The primary API method. Takes a format string and a set of positional arguments and returns the formatted result.
         * @example
         *
         * format("{0}, {1}, {2}", "a", "b", "c");
         * // =>  "a, b, c"
         * format("{}, {}, {}", "a", "b", "c");
         * // =>  "a, b, c"
         * format("{2}, {1}, {0}", "a", "b", "c");
         * // =>  "c, b, a"
         * format("{0}{1}{0}", "abra", "cad"); // arguments' indices can be repeated
         * // =>  "abracadabra"
         * 
         * @since 1.0.2
         */
        format(string: String, ...args: any[]): Formatter;

        /**
         * The same as `Formatter.format`, but access arguments by name.
         * 
         * @example
         * 
         * const str = format("Coordinates: {latitude}, {longitude}");
         * str.where({ latitude: "37.24N", longitude: "-115.81W" });
         * // =>  "Coordinates: 37.24N, -115.81W"
         * @since 1.0.2
         */
        where(assignments: Object): Formatter;
    }

    /**
     * Current Slys' version.
     *
     * @since 1.0.3
     */
    export const version: "1.0.3";

    /**
     * Represents a Formatter.
     *
     * @since 1.0.2
     */
    export class Formatter implements Formatter {
        public constructor(string: String);
    }

    /**
     * Returns `true` if all elements in `iterable` are `boolean`, otherwise returns `false`.
     * @example
     * 
     * all([ true, false ]);
     * // =>  false
     * all([ true, true ]);
     * // =>  true
     * all([ false, false ], false);
     * // =>  true
     * 
     * @since 1.0.3
     */
    export function all(iterable?: Iterable<any>, boolean?: Boolean): Boolean

    /**
     * Returns `true` if any element in `iterable` is `boolean`, otherwise returns `false`.
     * @example
     * 
     * any({ "foo": true, "bar": false });
     * // =>  true
     * any([ true, false ]);
     * // =>  true
     * any([ false, false ]);
     * // =>  false
     * any([ false, false ], false);
     * // =>  true
     * 
     * @since 1.0.3
     */
    export function any(iterable?: Iterable<any>, boolean?: any): Boolean;

    /**
     * Splits `iterable` into chunks with a length of `count` or less. If `exclude` is true, chunks with a length less than `count` will be excluded. 
     * @example
     * 
     * chunk([ 1, 2, 3, 4, 5, 6 ], 2)
     * // =>  [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]
     * chunk({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, 3)
     * // =>  [ { a: 1, b: 2, c: 3 }, { d: 4, e: 5, f: 6 } ]
     * chunk("hello world!", 6)
     * // =>  [ "hello ", "world!" ]
     * 
     * @since 1.0.3
     */
    export function chunk(iterable?: Iterable<any> | String, count?: Number, exclude?: Boolean): Iterable<any>[];

    /**
     * Takes a format string and a set of positional arguments and returns the formatted result.
     * @example
     *
     * format("{0}, {1}, {2}", "a", "b", "c");
     * // =>  "a, b, c"
     * format("{}, {}, {}", "a", "b", "c");
     * // =>  "a, b, c"
     * format("{2}, {1}, {0}", "a", "b", "c");
     * // =>  "c, b, a"
     * format("{0}{1}{0}", "abra", "cad"); // arguments' indices can be repeated
     * // =>  "abracadabra"
     * format("{foo}").where({ "foo": "bar" }));
     * // =>  "bar"
     *  
     * @since 1.0.2
     */
    export function format(string: String, ...args: any[]): Formatter;

    /**
     * Returns a list containing mathematic progressions. It returns a list of integers, increasing or decreasing `step` if positive or negative, relatively. The last element is the largest less than `stop` if positive or the smallest greater than `stop` if negative.
     * @example
     * 
     * range(10);
     * // =>  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
     * range(1, 11);
     * // =>  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
     * range(0, 30, 5);
     * // =>  [ 0, 5, 10, 15, 20, 25 ]
     * range(0, -10);
     * // =>  [ 0, -1, -2, -3, -4, -5, -6, -7, -8, -9 ]
     * range(0);
     * // =>  []
     * range(1, 0);
     * // =>  []
     * 
     * @since 1.0.2
     */
    export function range(start: Number, end?: Number, step?: Number): Number[];

    /**
     * Returns a list of tuples, where the i-th tuple contains the i-th element from each of the argument sequences or iterables.
     * @example
     * 
     * zip([ 1, 2 ]);
     * // =>  [ [ 1 ], [ 2 ] ]
     * zip([ 1, 2 ], [ 1, 2 ]);
     * // =>  [ [ 1, 1 ], [ 2, 2 ] ]
     * zip([ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ]);
     * // =>  [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ]
     * 
     * @since 1.0.2
     */
    export function zip(...iterable: Iterable<any>[]): any[][];
}