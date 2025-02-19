//We create api.js to handle all API requests efficiently.

const API_BASE_URL = "http://localhost:8080/api";

// Generic GET request
async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  return response.json();
}

// Generic POST request
async function postData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
  });
  return response.json();
}

// Generic PUT request (for updates)
async function updateData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
  });
  return response.json();
}

// Generic DELETE request
async function deleteData(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
  });
  return response.json();
}