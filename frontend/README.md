This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Authentication (complete)

- Authentication pages:
  - `/auth/login` — User login
  - `/auth/register` — Register new account
- Authentication state (user/token) is shared globally through `AuthContext` (DRY, no props chain).
- Global Navbar displays UserMenu with username and logout button if authenticated.
- Automatic redirect to homepage if already logged in and accessing /auth/login or /auth/register.

### Complete flow
1. Register a new account at `/auth/register` (you'll be automatically authenticated).
2. Log in at `/auth/login` if you already have an account.
3. JWT token and user info are saved in localStorage and accessible globally.
4. UserMenu in Navbar allows instant logout.
5. You cannot access login/register pages if already logged in.

### Example request (after login)
```js
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Notes
- For logout, use the button in UserMenu (removes token and user info from localStorage).
- For real protection, use HttpOnly cookies (see roadmap).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
