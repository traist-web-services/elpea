import type { RequestHandler } from "@sveltejs/kit";

const { VITE_REDIRECT_URI, VITE_SPOTIFY_CLIENT_ID } = import.meta.env;

const generateRandomString = function (length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


export const get: RequestHandler = () => {
  const scope = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read user-read-playback-position app-remote-control"

  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: VITE_SPOTIFY_CLIENT_ID as string,
    scope: scope,
    redirect_uri: VITE_REDIRECT_URI as string,
    state: state
  })

  return {
    status: 307,
    headers: { Location: 'https://accounts.spotify.com/authorize?' + auth_query_parameters.toString() }
  }
}

