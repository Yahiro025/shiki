import { transformerTwoslash } from '@shikijs/twoslash'
import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { rendererClassic, rendererRich } from '../src'

// Official TypeScript handbook syntax example from
// https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html#syntax
// reported in https://github.com/shikijs/shiki/issues/1267
const handbookSyntaxError = `// @errors: 1005
let a = (4
`

const handbookSyntaxErrorNoTrailingNewline = handbookSyntaxError.replace(/\n$/, '')

describe('issue #1267 handbook @errors + incomplete syntax', () => {
  it.each([
    ['with trailing newline', handbookSyntaxError],
    ['without trailing newline', handbookSyntaxErrorNoTrailingNewline],
  ])('renders with rendererRich (%s)', async (_name, code) => {
    const html = await codeToHtml(code, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [
        transformerTwoslash({
          renderer: rendererRich(),
        }),
      ],
    })

    expect(html).toContain('twoslash-error')
    expect(html).toContain('\')\' expected.')
    expect(html).not.toContain('<span class="line"><span class="twoslash-error"></span></span>')
    expect(html.indexOf('>4<')).toBeGreaterThan(-1)
    expect(html.indexOf('twoslash-error')).toBeGreaterThan(html.indexOf('>4<'))
  })

  it('renders hover error annotations without throwing', async () => {
    const html = await codeToHtml(handbookSyntaxError, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [
        transformerTwoslash({
          renderer: rendererRich({
            errorRendering: 'hover',
          }),
        }),
      ],
    })

    expect(html).toContain('twoslash-error')
    expect(html).toContain('\')\' expected.')
    expect(html.indexOf('twoslash-error')).toBeGreaterThan(html.indexOf('>4<'))
  })

  it('renders with rendererClassic without throwing', async () => {
    const html = await codeToHtml(handbookSyntaxError, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [
        transformerTwoslash({
          renderer: rendererClassic(),
        }),
      ],
    })

    expect(html).toContain('\')\' expected.')
  })
})
