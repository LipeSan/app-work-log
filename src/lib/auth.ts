import { NextAuthOptions } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaGetInstance } from './prisma-pg';
import bcrypt from 'bcryptjs';

const prisma = PrismaGetInstance();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', name: 'email' },
        password: { label: 'Password', type: 'password', name: 'password' },
      },
      async authorize(credentials, req): Promise<any> {
        if(!credentials?.email || !credentials?.password) {
          throw new Error('Missing fields!');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if(!user) {
          throw new Error('User not found!');
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if(!isPasswordValid) {
          throw new Error('Invalid password!');
        }
        return user;
      },
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/pages/login',
  },
  callbacks: {
    async jwt({ token, user }:any) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        return {
          ...token,
          user: {
            email: user.email,
            fullName: user.fullName,
            id: user.id
          }
        }
      }
      return token
    },
    async session({ session, token }:any) {
      // Send properties to the client, like an access_token from a provider.
      return {
        ...session,
        user: {
          id: token.user.id,
          fullName: token.user.fullName,
          email: token.user.email
      }
      }
    }
  }
};