export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            YourSpace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Platforma ta de social media personalizabilă, inspirată de MySpace
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Bine ai venit! 🎉
          </h2>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              Aceasta este platforma <strong>YourSpace</strong> - un proiect social media modern care îți permite să:
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Creezi un profil complet personalizabil cu HTML/CSS custom</li>
              <li>Comunici cu prietenii prin chat în timp real</li>
              <li>Publici și vezi postări în feed-ul social</li>
              <li>Folosești un asistent AI pentru a genera design-ul profilului tău (viitor)</li>
            </ul>

            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
                📚 Stack Tehnologic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Backend:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• .NET 10 + ASP.NET Core</li>
                    <li>• Entity Framework Core</li>
                    <li>• PostgreSQL</li>
                    <li>• SignalR (pentru chat)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Frontend:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Next.js 16 + React</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Status:</strong> Backend și frontend configurate ✅ | 
                Următorii pași: Autentificare utilizatori, profiluri customizabile, feed social
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
