export default function Home() {
  return (
    <div className="min-h-screen bg-black py-20 px-4 relative overflow-hidden"
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
      
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="y2k-heading y2k-heading-lg" style={{
            background: 'linear-gradient(90deg, #39ff14, #00ffff, #ff00ff, #39ff14)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            WELCOME TO YOURSPACE.
          </h1>
        </div>

        {/* Features Section */}
        <div className="y2k-card mb-12">
          <h2 className="y2k-heading y2k-heading-md mb-8" style={{
            color: '#39ff14',
            textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
          }}>
            FEATURES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="y2k-card" style={{ background: 'rgba(13, 59, 26, 0.4)' }}>
              <h3 style={{
                color: '#39ff14',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
              }}>
                FEED & POSTS
              </h3>
              <p style={{
                color: '#888888',
                fontSize: '0.95rem',
              }}>
                Share your thoughts and see posts from people you follow in real-time
              </p>
            </div>

            {/* Feature 2 */}
            <div className="y2k-card" style={{ background: 'rgba(13, 59, 26, 0.4)' }}>
              <h3 style={{
                color: '#00ffff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
              }}>
                REAL-TIME MESSAGING
              </h3>
              <p style={{
                color: '#888888',
                fontSize: '0.95rem',
              }}>
                Chat instantly with friends using our WebSocket-powered messaging system
              </p>
            </div>

            {/* Feature 3 */}
            <div className="y2k-card" style={{ background: 'rgba(13, 59, 26, 0.4)' }}>
              <h3 style={{
                color: '#39ff14',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
              }}>
                MAKE FRIENDS
              </h3>
              <p style={{
                color: '#888888',
                fontSize: '0.95rem',
              }}>
                Follow users and build your social network with ease
              </p>
            </div>

            {/* Feature 4 */}
            <div className="y2k-card" style={{ background: 'rgba(13, 59, 26, 0.4)' }}>
              <h3 style={{
                color: '#00ffff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
              }}>
                AI PROFILE BUILDER
              </h3>
              <p style={{
                color: '#888888',
                fontSize: '0.95rem',
              }}>
                Customize your profile with AI-generated HTML/CSS designs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
