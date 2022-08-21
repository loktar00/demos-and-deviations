module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    settings: {
        'import/resolver': {
            typescript: {}
        }
    },
    extends: [
        'plugin:react/recommended',
        'airbnb'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    rules: {
        'linebreak-style': 'off',
        'comma-dangle': ['error', 'never'],
        'import/extensions': [
            'error', {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never'
            }
        ],
        'arrow-parens': ['error', 'as-needed'],
        'react/function-component-definition': [1, { namedComponents: 'arrow-function' }],
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        indent: ['error', 4],
        'react/jsx-indent': [2, 4]
    }
};
