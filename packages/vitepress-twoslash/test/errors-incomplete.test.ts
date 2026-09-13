import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { codeToHast } from 'shiki'
import { expect, it } from 'vitest'

// Official TypeScript handbook syntax example from
// https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html#syntax
// reported in https://github.com/shikijs/shiki/issues/1267
const handbookSyntaxError = `// @errors: 1005
let a = (4
`

it('renders handbook @errors + incomplete syntax without throwing', async () => {
  const hast = await codeToHast(handbookSyntaxError, {
    lang: 'ts',
    theme: 'vitesse-dark',
    meta: {
      __raw: 'twoslash',
    },
    transformers: [
      transformerTwoslash(),
    ],
  })

  const serialized = JSON.stringify(hast)
  expect(serialized).toContain('twoslash-error')
  expect(serialized).toContain('\')\' expected.')
})
