export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to YourSpace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your personalized social media platform, inspired by MySpace
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Welcome!
          </h2>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-lg text-center">
              <strong>YourSpace</strong> is a modern social media platform where you can connect with friends and express yourself!
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">
                Current Features
              </h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-gray-900 dark:text-white">Feed & Posts</strong>
                  <p className="text-sm">Share your thoughts and see posts from people you follow</p>
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Real-Time Messaging</strong>
                  <p className="text-sm">Chat instantly with friends</p>
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Make Friends</strong>
                  <p className="text-sm">Follow users and build your social network</p>
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Edit Profile with AI Assistant</strong>
                  <p className="text-sm">Customize your profile with AI-generated HTML/CSS designs</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
