if (localStorage.getItem("loginKey") !== "true") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("loginKey");
  window.location.href = "login.html";
}
const tableElement = document.getElementById('table');


document.addEventListener("DOMContentLoaded",async()=>{
  const tbodyElement = document.getElementById('tbody');

  try{
    console.log("Fetching users...");  // Debugging log
    const users = await fetchData("users/summary/all");

    console.log("Received users:", users);  // Debugging log

    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML =`
        <td>${user.username}</td>
        <td>${user.totalInvestment}</td>
        <td>${user.totalLoan}</td>
        <td>${user.remainingLoanBalance}</td>
        <td>${user.remainingLoanMonths}</td>
        <td>${user.totalAccountBalance}</td>
      `
      tbodyElement.appendChild(tr);
    });
  }catch(error){
    console.error("Error loading users:", error);
  }

});



/*
private String username;
private Double totalInvestment;
private Double totalLoan;
private Double remainingLoanBalance;
private int remainingLoanMonths;
private Double totalAccountBalance;

*/