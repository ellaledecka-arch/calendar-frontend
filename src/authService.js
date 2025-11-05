// authService.js
const API_URL = "http://localhost:8080/api/v1/api/users";

export const register = async (username, email) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Registrácia zlyhala");
    }
    
    // Uloženie user ID do localStorage
    if (data.id) {
      localStorage.setItem("userId", data.id);
      localStorage.setItem("username", data.username);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (username, email) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Prihlásenie zlyhalo");
    }
    
    // Uloženie user ID do localStorage
    if (data.id) {
      localStorage.setItem("userId", data.id);
      localStorage.setItem("username", data.username);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
};

export const getCurrentUser = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  
  if (userId && username) {
    return {
      id: userId,
      username: username
    };
  }
  
  return null;
};
