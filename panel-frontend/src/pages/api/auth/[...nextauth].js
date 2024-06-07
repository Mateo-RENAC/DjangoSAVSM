import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {redirect} from "react-router-dom";


const setCSRFTokenCookie = (token) => {
  if (typeof window !== 'undefined') {
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // 1 day expiration
    document.cookie = `csrftoken=${token}; expires=${date.toUTCString()}; path=/`;
    console.log('CSRF token set in cookie:', token);
  }
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        console.log("Attempting connection");
        const res = await fetch('http://localhost:8000/panel/api/token/', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });

        const user = await res.json();

        if (res.ok && user) {
          console.log("Fetching CSRF token");
          // Fetch CSRF token after successful login
          const csrfRes = await fetch('http://localhost:8000/panel/csrf-token/', {
            credentials: 'include',
          });
          if (csrfRes.ok) {
            const data = await csrfRes.json();
            console.log('CSRF token:', data.csrfToken);
            // Manually set the CSRF cookie in the browser
            setCSRFTokenCookie(data.csrfToken);
            console.log('CSRF cookie set successfully');
          }
          return user;
        } else {
          console.error('Invalid credentials');
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    jwt: true,
  },
});
