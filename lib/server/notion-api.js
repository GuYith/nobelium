import { NotionAPI } from 'notion-client'

const { NOTION_ACCESS_TOKEN } = process.env

const recordMapTables = [
  'block',
  'collection',
  'collection_view',
  'notion_user'
]

function normalizeRecordMap (recordMap) {
  if (!recordMap) return recordMap

  for (const table of recordMapTables) {
    if (!recordMap[table]) continue

    for (const [id, record] of Object.entries(recordMap[table])) {
      // Notion may return records as:
      // { spaceId, value: { role, value: <record> } }
      // notion-client expects:
      // { role, value: <record> }
      if (record?.value?.value && record?.value?.role) {
        recordMap[table][id] = record.value
      }
    }
  }

  return recordMap
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

function isRetryableError (error) {
  const status = error?.statusCode ?? error?.response?.status
  const code = error?.code ?? error?.cause?.code
  return (
    status === 429 ||
    status >= 500 ||
    ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'].includes(code) ||
    /fetch failed|no response/i.test(error?.message ?? '')
  )
}

async function withRetry (request, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await request()
    } catch (error) {
      lastError = error
      if (!isRetryableError(error) || attempt === attempts) throw error
      await wait(500 * (2 ** (attempt - 1)))
    }
  }
  throw lastError
}

class CompatibleNotionAPI extends NotionAPI {
  async getPageRaw (...args) {
    const response = await withRetry(() => super.getPageRaw(...args))
    normalizeRecordMap(response?.recordMap)
    return response
  }

  async getBlocks (...args) {
    const response = await withRetry(() => super.getBlocks(...args))
    normalizeRecordMap(response?.recordMap)
    return response
  }

  async getCollectionData (...args) {
    const response = await withRetry(() => super.getCollectionData(...args))
    normalizeRecordMap(response?.recordMap)
    return response
  }

  async getUsers (...args) {
    const response = await withRetry(() => super.getUsers(...args))
    normalizeRecordMap(response?.recordMap)
    normalizeRecordMap(response?.recordMapWithRoles)
    return response
  }
}

const client = new CompatibleNotionAPI({ authToken: NOTION_ACCESS_TOKEN })

export default client
