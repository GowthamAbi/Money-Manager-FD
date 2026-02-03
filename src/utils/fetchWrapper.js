// src/utils/fetchWrapper.js
const fetchWrapper = async (url, method = "GET", body = null) => {
    try {
      const headers = { "Content-Type": "application/json" };
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("API Call Error:", error);
      throw error;
    }
  };
  
  export default fetchWrapper;
  