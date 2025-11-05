// EventService.js
const API_URL = "http://localhost:8080/api/v1/api/events";

export const createEvent = async (eventData, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to create an event");
    }
    
    const response = await fetch(`${API_URL}?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create event");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserEvents = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllUserEvents = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/all`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getEventsInRange = async (userId, startDate, endDate) => {
  try {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    const response = await fetch(
      `${API_URL}/user/${userId}/range?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllEventsInRange = async (userId, startDate, endDate) => {
  try {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    const response = await fetch(
      `${API_URL}/user/${userId}/all/range?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    console.log("DEBUG Frontend: Original eventData:", eventData);
    
    // Create a copy of the data with properly formatted permissions
    const formattedData = { ...eventData };
    
    // Convert the userPermissions object to use IDs as keys instead of User objects
    if (formattedData.userPermissions) {
      const idBasedPermissions = {};
      for (const userId in formattedData.userPermissions) {
        idBasedPermissions[userId] = formattedData.userPermissions[userId];
      }
      formattedData.userPermissions = idBasedPermissions;
      console.log("DEBUG Frontend: Formatted userPermissions:", formattedData.userPermissions);
    } else {
      console.log("DEBUG Frontend: No userPermissions in eventData");
    }
    
    console.log("DEBUG Frontend: Full payload being sent:", JSON.stringify(formattedData, null, 2));
    
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to update event");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete event");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const shareEvent = async (eventId, userId, permission = "VIEW") => {
  try {
    const response = await fetch(`${API_URL}/${eventId}/share/${userId}?permission=${permission}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to share event");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const shareEventWithUsers = async (eventId, userPermissions) => {
  try {
    const response = await fetch(`${API_URL}/${eventId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPermissions),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to share event with users");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeSharedUser = async (eventId, userId) => {
  try {
    const response = await fetch(`${API_URL}/${eventId}/share/${userId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove shared user");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSharedEvents = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/shared/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch shared events");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSharedEventsInRange = async (userId, startDate, endDate) => {
  try {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    const response = await fetch(
      `${API_URL}/shared/${userId}/range?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch shared events");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getEventSharedUsers = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/${eventId}/shared-users`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch shared users");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return '#FF5252';
    case 'MEDIUM':
      return '#FFC107';
    case 'LOW':
      return '#4CAF50';
    default:
      return '#2196F3';
  }
};