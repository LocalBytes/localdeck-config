import js from '@eslint/js'
import {defineConfig} from 'eslint/config'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig(
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        plugins: {'@stylistic': stylistic},
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
)
