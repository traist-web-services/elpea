import type { RequestHandler } from "@sveltejs/kit"

export const get: RequestHandler = () => {
  return {
    headers: {
      'set-cookie': [
        `spotify_access_token=deleted; Path=/; Max-Age=-1`,
        `spotify_refresh_token=deleted; Path=/; Max-Age=-1`,
      ],
      Location: '/'
    },
    status: 302
  }
}