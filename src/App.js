import { useState, useEffect } from 'react';
import './App.css';
import { auth, loginWithEmailAndPassword, registerWithEmailAndPassword, logoutUser, getUserId } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Calendar from './Calendar';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Sledovať stav autentifikácie
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      
      // Get userId directly from localStorage
      const storedUserId = localStorage.getItem('userId');
      console.log("User ID from localStorage:", storedUserId);
      setUserId(storedUserId);
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Pri načítaní komponenty - odoslanie ID používateľa na server
  useEffect(() => {
    // Kontrola, či je používateľ prihlásený
    if (user) {
      const localUserId = localStorage.getItem('userId');
      if (localUserId) {
        // Set userId state
        setUserId(localUserId);
        // Odoslanie ID na server
        sendUserIdToServer(localUserId);
      } else {
        console.error("User is logged in but userId is not in localStorage");
      }
    }
  }, [user]);

  // Funkcia na odoslanie ID používateľa na server
  const sendUserIdToServer = async (userId) => {
    try {
      console.log("Sending userId to server:", userId);
      const response = await fetch('http://localhost:8080/api/v1/api/users/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId })
      });

      if (!response.ok) {
        console.error('Chyba pri odoslaní ID na server:', response.status);
      } else {
        console.log('ID používateľa úspešne odoslané na server');
      }
    } catch (error) {
      console.error('Chyba pri komunikácii so serverom:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        // Prihlásenie
        const result = await loginWithEmailAndPassword(email, password);
        if (result.error) {
          setError(result.error);
        } else if (result.user) {
          // Get userId directly after login
          const localUserId = localStorage.getItem('userId');
          console.log("After login, userId from localStorage:", localUserId);
          setUserId(localUserId);
        }
      } else {
        // Registrácia s menom používateľa
        const result = await registerWithEmailAndPassword(email, password, username);
        if (result.error) {
          setError(result.error);
        } else if (result.user) {
          // Get userId directly after registration
          const localUserId = localStorage.getItem('userId');
          console.log("After registration, userId from localStorage:", localUserId);
          setUserId(localUserId);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.error) {
      setError(result.error);
    } else {
      // Clear userId on logout
      setUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Načítavanie...</p>
        </header>
      </div>
    );
  }

  if (user) {
    return (
      <div className="App">
        <div className="app-container">
          <nav className="app-nav">
            <div className="user-info">
              <h3>Osobný kalendár</h3>
              <p>{user.displayName || user.email}</p>
              <p>ID: {userId}</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">Odhlásiť sa</button>
          </nav>
          
          <main className="app-content">
            {/* Pass userId directly, not through a function call */}
            <Calendar userId={userId} />
          </main>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{isLogin ? 'Prihlásenie' : 'Registrácia'}</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Heslo:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label>Používateľské meno:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required={!isLogin}
              />
            </div>
          )}
          
          <button type="submit" className="submit-btn">
            {isLogin ? 'Prihlásiť' : 'Registrovať'}
          </button>
        </form>
        
        <p className="toggle-form">
          {isLogin ? 'Nemáte účet?' : 'Už máte účet?'} 
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-btn"
          >
            {isLogin ? 'Registrovať' : 'Prihlásiť'}
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;