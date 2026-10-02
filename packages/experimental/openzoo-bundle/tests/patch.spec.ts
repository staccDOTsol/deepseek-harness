/** The experimental OpenZoo bundle points the shipped llm-pi-ai row at zkAPI and OpenAnonymity routes. */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as yaml from 'js-yaml'
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include'

const root = fileURLToPath(new URL('..', import.meta.url))

interface Manifest {
  name?: string
  icon?: string
  private?: boolean
  publishConfig?: { access?: string }
  exports?: Record<string, unknown>
  dependencies?: Record<string, string>
  dsh?: { bundle?: { patch?: string } }
}

describe('experimental OpenZoo bundle', () => {
  const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as Manifest

  it('publishes as an experimental bundle with plugin-manager display metadata', () => {
    expect(manifest.name).toBe('@deepseek-ai/dsh-experimental-openzoo-bundle')
    expect(manifest.private).toBeUndefined()
    expect(manifest.publishConfig?.access).toBe('public')
    expect(manifest.icon).toBe('./icon.svg')
    expect(manifest.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(manifest.exports?.['./locale/*.json']).toBe('./locale/*.json')
    expect(manifest.exports?.['./cordis.patch.yml']).toBe('./cordis.patch.yml')
    expect(Object.keys(manifest.dependencies ?? {})).toEqual(['@deepseek-ai/dsh-llm-pi-ai'])
  })

  it('configures the zkAPI and OpenAnonymity routes on the shipped llm-pi-ai row', () => {
    const parsed = yaml.load(readFileSync(resolve(root, './cordis.patch.yml'), 'utf8'), { schema: entryListSchema })
    expect(parsed).toEqual([{
      id: 'llm-pi-ai',
      name: '@deepseek-ai/dsh-llm-pi-ai',
      config: {
        providers: {
          zkapi: {
            displayName: 'zkAPI / OpenAnonymity',
            api: 'openai-completions',
            baseURL: 'http://127.0.0.1:8787/v1',
            models: [
              { id: 'openrouter/auto', name: 'OpenRouter Auto via zkAPI', contextWindow: 200000, maxTokens: 8192 },
              { id: 'openai/gpt-5.3-chat', name: 'OpenAI GPT-5.3 Chat via zkAPI', contextWindow: 200000, maxTokens: 8192 },
            ],
          },
          openanonymity: {
            displayName: 'OpenAnonymity',
            api: 'openai-completions',
            baseURL: 'https://openrouter.ai/api/v1',
            apiKeyEnv: 'OPENROUTER_API_KEY',
            models: [
              { id: 'openrouter/auto', name: 'OpenRouter Auto', contextWindow: 200000, maxTokens: 8192 },
              { id: 'openai/gpt-5.3-chat', name: 'OpenAI GPT-5.3 Chat', contextWindow: 200000, maxTokens: 8192 },
            ],
          },
        },
      },
    }])
  })
})
