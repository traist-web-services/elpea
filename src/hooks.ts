import type { Handle, GetSession } from '@sveltejs/kit';
import cookie from 'cookie';
const { VITE_HOST } = import.meta.env;

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	if (!cookies || Object.keys(cookies).length === 0 || request.path === `/api/auth/token`) {
		return await resolve(request);
	}
	try {
		const tokenRes = await fetch(`${VITE_HOST}/api/auth/token?spotify_refresh_token=${cookies.spotify_refresh_token}`);
		const tokenJson = await tokenRes.json()
		const { spotify_access_token: access_token } = tokenJson
		const req = await fetch(`https://api.spotify.com/v1/me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});
		const res = await req.json();
		if (res.id) {
			request.locals.user = {
				...res,
				access_token
			};
		}

		const response = await resolve(request);
		return response;
	} catch (err) {
		return await resolve(request)
	}
}
export const getSession: GetSession = async (req) => {
	return req.locals
}
