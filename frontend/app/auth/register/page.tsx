import RegisterForm from "../../../components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-black py-20 px-4 relative"
              style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(57, 255, 20, 0.03) 2px,
                      rgba(57, 255, 20, 0.03) 4px
                    )
                  `,
              }}>
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2339ff14" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}></div>
            <RegisterForm />
        </main>
    );
}
