import { createElement as h } from 'react'
import dynamic from 'next/dynamic'
import { NotionRenderer as Renderer } from 'react-notion-x'
import { getTextContent } from 'notion-utils'
import { FONTS_SANS, FONTS_SERIF } from '@/consts'
import { useConfig } from '@/lib/config'

// Lazy-load some heavy components & override the renderers of some block types
const components = {
  /* Lazy-load */

  // Code block
  Code: dynamic(async () => {
    return function CodeSwitch (props) {
      switch (getTextContent(props.block.properties.language)) {
        case 'Mermaid':
          return h(
            dynamic(() => {
              return import('@/components/notion-blocks/Mermaid').then(module => module.default)
            }, { ssr: false }),
            props
          )
        default:
          return h(
            dynamic(() => {
              return import('react-notion-x/third-party/code').then(async module => {
                // Additional prismjs syntax
                await Promise.all([
                  import('prismjs/components/prism-markup-templating.js'),
                  import('prismjs/components/prism-markup.js'),
                  import('prismjs/components/prism-bash.js'),
                  import('prismjs/components/prism-c.js'),
                  import('prismjs/components/prism-cpp.js'),
                  import('prismjs/components/prism-csharp.js'),
                  import('prismjs/components/prism-docker.js'),
                  import('prismjs/components/prism-java.js'),
                  import('prismjs/components/prism-js-templates.js'),
                  import('prismjs/components/prism-coffeescript.js'),
                  import('prismjs/components/prism-diff.js'),
                  import('prismjs/components/prism-git.js'),
                  import('prismjs/components/prism-go.js'),
                  import('prismjs/components/prism-graphql.js'),
                  import('prismjs/components/prism-handlebars.js'),
                  import('prismjs/components/prism-less.js'),
                  import('prismjs/components/prism-makefile.js'),
                  import('prismjs/components/prism-markdown.js'),
                  import('prismjs/components/prism-objectivec.js'),
                  import('prismjs/components/prism-ocaml.js'),
                  import('prismjs/components/prism-python.js'),
                  import('prismjs/components/prism-reason.js'),
                  import('prismjs/components/prism-rust.js'),
                  import('prismjs/components/prism-sass.js'),
                  import('prismjs/components/prism-scss.js'),
                  import('prismjs/components/prism-solidity.js'),
                  import('prismjs/components/prism-sql.js'),
                  import('prismjs/components/prism-stylus.js'),
                  import('prismjs/components/prism-swift.js'),
                  import('prismjs/components/prism-wasm.js'),
                  import('prismjs/components/prism-yaml.js')
                ])
                return module.Code
              })
            }),
            props
          )
      }
    }
  }),
  // Database block
  Collection: dynamic(() => {
    return import('react-notion-x/third-party/collection').then(module => module.Collection)
  }),
  // Equation block & inline variant
  Equation: dynamic(() => {
    return import('react-notion-x/third-party/equation').then(module => module.Equation)
  }),
  // PDF (Embed block)
  Pdf: dynamic(() => {
    return import('react-notion-x/third-party/pdf').then(module => module.Pdf)
  }, { ssr: false }),
  // Tweet block
  Tweet: dynamic(() => {
    return import('react-tweet-embed').then(module => {
      const { default: TweetEmbed } = module
      return function Tweet ({ id }) {
        return <TweetEmbed tweetId={id} options={{ theme: 'dark' }} />
      }
    })
  })
}

const mapPageUrl = id => `https://www.notion.so/${id.replace(/-/g, '')}`

/**
 * Notion page renderer
 *
 * A wrapper of react-notion-x/NotionRenderer with predefined `components` and `mapPageUrl`
 *
 * @param props - Anything that react-notion-x/NotionRenderer supports
 */
export default function NotionRenderer (props) {
  const config = useConfig()

  const font = {
    'sans-serif': FONTS_SANS,
    'serif': FONTS_SERIF
  }[config.font]

  return (
    <>
      <style jsx global>
        {`
        .notion {
          --notion-font: ${font};
        }
        `}
      </style>
      <Renderer
        components={components}
        mapPageUrl={mapPageUrl}
        {...props}
      />
    </>
  )
}
