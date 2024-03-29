module.exports = {
    'env': {
        'browser': true,
        'es6': true,
    },
    parser: '@typescript-eslint/parser',
    'extends': [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        //  "plugin:react/recommended", // TODO: enable once
    ],
    'ignorePatterns': ['**/api/**/*.js'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true,
        },
        'sourceType': 'module',
    },
    'plugins': [
        'react',
        '@typescript-eslint',
    ],
    'globals': {
        '__dirname': false,
        'process': false,
        'require': false,
        'module': false,
        'jsx': 'readonly',
        jsdom: true,
    },
    'settings': {
        'react': {
            'pragma': 'React',  // Pragma to use, default to 'React'
            'version': '16.0', // React version, default to the latest React stable release
        },
    },
    'rules': {
        'comma-dangle': ['error', 'always-multiline'],
        'no-console':  'error',
        'no-debugger': 'error',
        '@typescript-eslint/no-unused-vars': [2, { 'ignoreRestSiblings': true, 'varsIgnorePattern': '_+', 'argsIgnorePattern': '^_' }],
        'consistent-return': [0, { 'treatUndefinedAsUnspecified': true }],
        'object-curly-spacing': ['error', 'always'],
        'no-empty': ['error', { 'allowEmptyCatch': true }],
        'no-multiple-empty-lines': [2, { 'max': 2, 'maxEOF': 0 }],
        'no-multi-spaces': [2, {
            'exceptions': {
                'Identifier': true,
                'ObjectExpression': true,
                'ClassProperty': true,
                'ImportDeclaration': true,
                'VariableDeclarator': true,
                'AssignmentExpression': true,
                'ReturnStatement': true,
                'BlockStatement': true,
                'IfStatement': true,
                'JSXAttribute': true,
                'JSXIdentifier': true,
                'JSXOpeningElement': true,
                'JSXClosingElement': true,
            },
        }],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'quotes': [ 'error', 'single', { avoidEscape: true, 'allowTemplateLiterals': true } ],
        'semi': [0, 'always'],
        'react/prefer-stateless-function': [2, {
            'ignorePureComponents': true,
        }],
        'react/prop-types': 2,
        'react/jsx-uses-vars': ['error'],
        'react/jsx-uses-react':  ['error'],
        'indent': 'off',
        '@typescript-eslint/indent': ['error', 4, {
            'SwitchCase': 1,
            'MemberExpression': 'off',
        }],
        'react/jsx-indent-props': [2, 4],
        'key-spacing': [2, {
            'singleLine': {
                'beforeColon': false,
                'afterColon':  true,
            },
            'multiLine': {
                'beforeColon': false,
                'afterColon':  true,
                'mode': 'minimum',
            },
        }],
    },
    'overrides': [
        {
            'files': '*.ts?',
            'rules': {
                'react/prop-types': 0,
                'no-undef': 'off',
            },
        },
    ],
};
