//We create api.js to handle all API requests efficiently.

const API_BASE_URL = "https://userdatastore-production.up.railway.app/api";

// Generic GET request
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
} catch (error) {
    console.error("Fetch error:", error);
    return [];
}
}

// Generic POST request
async function postData(endpoint, data) {
  //console.log("Sending POST to: ", `${API_BASE_URL}/${endpoint}`); // ✅ Debugging log
  //console.log("POST Data: ", data); // ✅ Debugging log

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
  });

  if (!response.ok){
    console.error("POST faild with status: ", response.status);
  }
  return response.json();

  /*
  Check the Console logs:
Do you see Adding new user: followed by the name and email?
✅ If yes → The event listener is working.
❌ If no → The event listener is not added correctly.

Do you see Sending POST to: followed by the API URL?
✅ If yes → The postData() function is working.
❌ If no → The postData() function is not called correctly.

Do you see POST failed with status:?
✅ If yes → There’s an issue with the backend API.
❌ If no → The request is probably being blocked (check CORS).
  */
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
      // ✅ Check if the request was successful
  if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
  }

    // ✅ Use .text() instead of .json()
  const result = await response.text();

  return result;
}