import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        rules: {
            // Keep critical errors as errors (things that break the app)
            'react/jsx-key': 'error',
            'react-hooks/rules-of-hooks': 'error',

            // Downgrade stylistic/non-breaking issues to warnings
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            'react/no-unescaped-entities': 'off',
            '@next/next/no-img-element': 'warn',
            'prefer-const': 'warn',
            'no-console': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
        },
    },
]

export default eslintConfig
