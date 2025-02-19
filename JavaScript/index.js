const form = document.getElementById('loginForm');

form.addEventListener('submit', (e)=>{
  e.preventDefault();

  const unsernsmeElement = document.getElementById('username').value;
  const passwordElement = document.getElementById('password').value;

  const correctUsername = "ali";
  const correctPassword = "ali" ;

  if (unsernsmeElement === correctUsername 
    && passwordElement === correctPassword){
    
      localStorage.setItem('loginKey' , "true");
      window.location.href = "dashboard.html";
  }else{
    document.getElementById("errorMessage").style.display = "block";
  }
});