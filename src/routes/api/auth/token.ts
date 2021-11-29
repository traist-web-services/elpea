import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';


const { VITE_REDIRECT_URI, VITE_SPOTIFY_CLIENT_ID, VITE_SPOTIFY_CLIENT_SECRET } = import.meta.env;

export const get: RequestHandler = async ({ headers, query }) => {
  const cookies = cookie.parse(headers.cookie || '');
  if (cookies.spotify_access_token) {
    return {
      status: 200,
      body: JSON.stringify({ spotify_access_token: cookies.spotify_access_token })
    }
  }

  const refreshToken = cookies.spotify_refresh_token || query.get('spotify_refresh_token');
  if (!refreshToken) {
    return {
      status: 401,
      body: 'No refresh token set'
    }
  }

  const authOptions = {
    refresh_token: refreshToken,
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
    console.log(response);
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