/** @type {import("prettier").Config} */
export default {
    // Indentation
    tabWidth: 4,
    useTabs: false,

    // Semicolons — optional (omit them)
    semi: false,

    // Quotes
    singleQuote: true,
    jsxSingleQuote: false,

    // Trailing commas — es5: objects, arrays, params (not function params in TS generics)
    trailingComma: 'es5',

    // Line length
    printWidth: 100,

    // Bracket spacing: { foo } not {foo}
    bracketSpacing: true,

    // JSX — put closing > on its own line for multi-line elements
    bracketSameLine: false,

    // Arrow function parens: always  (x) => x  not  x => x
    arrowParens: 'always',

    // End of line
    endOfLine: 'lf',
}
