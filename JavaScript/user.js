const usersList = document.getElementById('usersList');
const username = document.getElementById('username');

document.addEventListener('DOMContentLoaded',async()=>{

  const userId = new URLSearchParams(window.location.search).get('userId');
  if (!userId) return;

  const userDetails = await fetchData(`users/summary/${userId}`);
  console.log(userDetails)

  username.textContent = userDetails.username;

})