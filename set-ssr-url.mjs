
import { readFileSync, writeFileSync } from 'node:fs'

const endpoint = process.env.TAXONPAGES_SSR_URL
const url = new URL(endpoint)

if (!['http:', 'https:'].includes(url.protocol)) {
  throw new Error('TAXONPAGES_SSR_URL must be an HTTP(S) URL')
}

// Check the TaxonWorks API before changing configuration.
const pingUrl = new URL(url)
pingUrl.pathname = url.pathname.replace(/\/+$/, '') + '/ping'
pingUrl.search = ''
pingUrl.hash = ''

const maxAttempts = 5

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    const response = await fetch(pingUrl, {
      signal: AbortSignal.timeout(5000),
      redirect: 'manual'
    })

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}`)
    }

    const body = await response.json()

    if (body?.pong !== true) {
      throw new Error('Unexpected ping response')
    }

    console.log(`TaxonWorks API reachable: ${pingUrl}`)
    break
  } catch (error) {
    console.error(
      `TaxonWorks API check ${attempt}/${maxAttempts} failed: ${error.message}`
    )

    if (attempt === maxAttempts) {
      throw new Error('TaxonWorks API is unreachable', { cause: error })
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

// Update only the server-side endpoint.
const path = 'config/api.yml'
const original = readFileSync(path, 'utf8')

const keyPattern = /^ssr_url[ \t]*:[^\r\n]*$/gm
const matches = original.match(keyPattern) ?? []

if (matches.length > 1) {
  throw new Error(`Duplicate ssr_url entries in ${path}`)
}

const line = `ssr_url: ${JSON.stringify(endpoint)}`

const updated = matches.length
  ? original.replace(keyPattern, line)
  : `${original.trimEnd()}\n${line}\n`

writeFileSync(path, updated)

