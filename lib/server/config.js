const fs = require('fs')
const { resolve } = require('path')

const raw = fs.readFileSync(resolve(process.cwd(), 'blog.config.js'), 'utf-8')
const config = eval(`((module = { exports }) => { ${raw}; return module.exports })()`)

// Never serialize server credentials into page props or /api/config.
const { notionAccessToken: _notionAccessToken, ...clientConfig } = config

module.exports = {
  config,
  clientConfig
}
