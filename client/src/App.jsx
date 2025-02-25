import { useState } from 'react'
import MicrosoftLogin from './components/auth/MicrosoftLogin'
import LocalLogin from './components/auth/LocalLogin'
import TicketList from './components/tickets/TicketList'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthChange = (authenticated, userData) => {
    setIsAuthenticated(authenticated);
    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modern Ticketing System</h1>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex space-x-4">
                <MicrosoftLogin onAuthChange={handleAuthChange} />
                <span className="text-gray-500 dark:text-gray-400">or</span>
                <LocalLogin onAuthChange={handleAuthChange} />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={() => handleAuthChange(false, null)}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
              Welcome to Modern Ticketing System
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Please sign in to access the ticketing system
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">My Tickets</h2>
                <TicketList isAuthenticated={isAuthenticated} />
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
                <button className="btn-primary w-full mb-3">
                  Create New Ticket
                </button>
                <button className="btn-secondary w-full">
                  View Knowledge Base
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
