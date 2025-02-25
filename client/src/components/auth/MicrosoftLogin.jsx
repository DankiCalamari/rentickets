import { useState, useEffect } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const loginRequest = {
  scopes: ['User.Read', 'Mail.Read'],
};

const MicrosoftLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [msalInstance, setMsalInstance] = useState(null);

  useEffect(() => {
    const msalInstance = new PublicClientApplication(msalConfig);
    setMsalInstance(msalInstance);

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setIsAuthenticated(true);
      setUser(accounts[0]);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      setIsAuthenticated(true);
      setUser(loginResponse.account);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = () => {
    msalInstance.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Microsoft
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Welcome, {user?.name || user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default MicrosoftLogin;