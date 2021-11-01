export const getToken = async (): Promise<string> => {
  const res = await fetch('/api/auth/token');
  const json = await res.json();
  return json.spotify_access_token;
}