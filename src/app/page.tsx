export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            konversations.ai
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to Konversations.ai - Your intelligent conversation platform powered by AI
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Conversations</h3>
            <p className="text-gray-600">Experience natural, intelligent conversations with advanced AI technology.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analytics</h3>
            <p className="text-gray-600">Get insights from your conversations with powerful analytics and reporting.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Integration</h3>
            <p className="text-gray-600">Easily integrate with your existing tools and workflows.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
