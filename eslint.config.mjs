import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', 'README.md'],
    },
    {
        files: ['**/*.ts'],
    },
    ...tseslint.configs.recommended,
    {
        rules: {
            eqeqeq: ['error', 'always'],
        },
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
        },
    },
    eslintConfigPrettier
);
