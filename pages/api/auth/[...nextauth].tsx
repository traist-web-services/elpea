import NextAuth from "next-auth";
import Providers from "next-auth/providers";

interface Token {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  product: string;
}

interface User {}
interface Profile {
  product: string;
}

interface Account {
  accessToken: string;
  expires_in: number;
  refresh_token: string;
}

interface Session {
  user: User;
}

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
    async jwt(token: Token, user: User, account: Account, profile: Profile) {
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
        console.log("Token OK", token);
        return token;
      }
      return refreshAccessToken(token);
    },
    async session(session: Session, user: User) {
      if (user) {
        session.user = user;
      }
      return session;
    },
  },
});

async function refreshAccessToken(token: Token) {
  console.log("Token expired", token);
  try {
    const url = `https://accounts.spotify.com/api/token`;

    const response = await fetch(url, {
      body: new URLSearchParams({
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

    console.log("Token refreshed successfully");
    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000 - 10,
      refreshToken: tokens.refresh_token,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
    };
  }
}
