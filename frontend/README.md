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


## Autentificare (complet)

- Paginile de autentificare:
  - `/auth/login` — Login utilizator
  - `/auth/register` — Înregistrare cont nou
- Starea de autentificare (user/token) este partajată global prin `AuthContext` (DRY, fără props chain).
- Navbar-ul global afișează UserMenu cu numele utilizatorului și buton de logout dacă ești autentificat.
- Redirect automat către homepage dacă ești deja logat și accesezi /auth/login sau /auth/register.

### Flux complet
1. Înregistrează un cont nou la `/auth/register` (vei fi autentificat automat).
2. Autentifică-te la `/auth/login` dacă ai deja cont.
3. Tokenul JWT și user info sunt salvate în localStorage și accesibile global.
4. UserMenu din Navbar permite logout instant.
5. Nu poți accesa paginile de login/register dacă ești deja logat.

### Exemplu request (după login)
```js
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Note
- Pentru logout, folosește butonul din UserMenu (șterge tokenul și user info din localStorage).
- Pentru protecție reală, folosește HttpOnly cookies (vezi roadmap).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
