export const getToken = async (): Promise<string> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_HOST}/api/auth/token`);
    const json = await res.json();
    return json.spotify_access_token;
  } catch (e) {
    return;
  }
}
