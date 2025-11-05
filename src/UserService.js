// UserService.js
const API_URL = "http://localhost:8080/api/v1/api/users";

// Get all users (for sharing events)
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}`);

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Search users by username (for sharing events)
export const searchUsers = async (searchTerm) => {
  try {
    const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(searchTerm)}`);

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to search users");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/email/${encodeURIComponent(email)}`);
    
    if (response.status === 404) {
      return null;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Find or create a user by email
export const findOrCreateUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/find-or-create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to find or create user");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};