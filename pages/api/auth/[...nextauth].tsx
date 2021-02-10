import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      scope:
        "user-library-read streaming user-read-playback-state user-modify-playback-state user-read-email user-read-private",
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      if (profile?.product) {
        token.product = profile.product;
      }
      if (user && account) {
        token.accessTokenExpires = Date.now() + account.expires_in * 1000 - 10;
        token.refreshToken = account.refresh_token;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session(session, user) {
      if (user) {
        session.user = user;
      }
      return session;
    },
  },
});

async function refreshAccessToken(token) {
  try {
    const url = `https://accounts.spotify.com/api/token`;

    const response = await fetch(url, {
      body: new URLSearchParams({
        // client_id: process.env.SPOTIFY_CLIENT_ID,
        // client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    const tokens = await response.json();

    if (!response.ok) {
      throw tokens;
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000,
      refreshToken: tokens.refresh_token,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
    };
  }
}
