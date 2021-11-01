import type { RequestHandler } from "@sveltejs/kit";

const { VITE_REDIRECT_URI, VITE_SPOTIFY_CLIENT_ID, VITE_SPOTIFY_CLIENT_SECRET } = import.meta.env;
export const get: RequestHandler = async ({ query }) => {
  const code = query.get('code');

  const authOptions = {
    refresh_token: code,
    redirect_uri: VITE_REDIRECT_URI as string,
    grant_type: 'refresh_token'
  };

  const request = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams(authOptions),
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(VITE_SPOTIFY_CLIENT_ID + ':' + VITE_SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  const response = await request.json();

  if (response.error) {
    console.log(response.error);
    return {
      headers: { Location: '/' },
      status: 500
    }
  }

  const access_token_expires_in = new Date(Date.now() + response.expires_in);
  return {
    headers: {
      'set-cookie': [
        `spotify_access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}}`,
      ],
    },
    status: 200,
    body: JSON.stringify({ spotify_access_token: response.access_token })
  }
}