import { defaultMapImageUrl, isUrl } from "notion-utils"

export default function mapImageUrl({url, block}) {
  if(isUrl(url)) {
    return defaultMapImageUrl(url, block)
  } else {
    return url
  }
}
