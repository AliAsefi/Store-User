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
  const thead = document.getElementById('thead');

  try{
    const users = await fetchData("users/summary/all");

      const headers = ['Row','Name','Total Investment','Total Loan','Remaining Loan Balance','Remaining Loan Months','Total Account Balance'];  
      headers.forEach((user,index)=>{
      const th = document.createElement('th');
      th.textContent = user;
      th.style.cursor = 'pointer';
      th.onclick = ()=> sortTable(index);

      thead.appendChild(th);
    });

    users.forEach((user,index) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';

      tr.onclick=(()=>{
        window.location.href = `user.html?userId=${user.userId}`;
      })
      tr.innerHTML =`
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.totalInvestment}</td>
        <td>${user.totalLoan}</td>
        <td>${user.remainingLoanBalance}</td>
        <td>${user.remainingLoanMonths}</td>
        <td>${user.totalAccountBalance}</td>
      `
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = (e)=>{
        e.stopPropagation();
        deleteUser(`${user.userId}`);
      }

      tr.appendChild(deleteBtn);
      tbodyElement.appendChild(tr);
    });
  }catch(error){
    console.error("Error loading users:", error);
  }
});

function fillterTable(){
  const searchInput = document.getElementById("searchInput").value;
  const rows = document.querySelectorAll('#tbody tr');

  rows.forEach(row =>{
    const username = row.cells[1].textContent.toLowerCase();
    row.style.display = username.includes(searchInput) ? '' : 'none';
  })
}

// Track sorting state for each column
let sortOrder = {};

function sortTable(columnIndex) {
  const table = document.querySelector("table tbody");
  const rows = Array.from(table.rows);

  // Toggle sorting order
  sortOrder[columnIndex] = !sortOrder[columnIndex];
  const order = sortOrder[columnIndex] ? 1 : -1;  // 1 for ASC, -1 for DESC

  rows.sort((a, b) => {
    // ✅ Numeric sorting for money-related columns
    if (columnIndex > 0) { // Skip first column (No)
      const aValue = parseFloat(a.cells[columnIndex].textContent.replace(/[$,]/g, "")) || 0;
      const bValue = parseFloat(b.cells[columnIndex].textContent.replace(/[$,]/g, "")) || 0;
      return (aValue - bValue) * order;
    }

    // ✅ String sorting (e.g., for names)
    return a.cells[columnIndex].textContent.localeCompare(b.cells[columnIndex].textContent) * order;
  });

  // ✅ Reattach sorted rows
  rows.forEach(row => table.appendChild(row));
}


const addUser = document.getElementById('addUserForm');

addUser.addEventListener('submit',async(e)=>{
  e.preventDefault();

  const newFirstname = document.getElementById('firstname').value;
  const newLastname = document.getElementById('lastname').value;

  const newUser = {
    firstname : newFirstname,
    lastname : newLastname
  }

  try {
    const endpoint = "users/create";

    await postData(endpoint,newUser);
    alert("User added successfully!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error adding user: ", error);
    alert("Faild to add user.")
  }
})



async function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
      try {
          await deleteData(`users/${userId}`);  // ✅ Call DELETE API to remove user
          alert("User deleted successfully!");
          window.location.href = "dashboard.html"; // ✅ Redirect back to the dashboard
          //window.location.reload(); // Refresh to see the updated user list
      } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
      }
  }
}






/*
private Long userId;
private String username;
private Double totalInvestment;
private Double totalLoan;
private Double remainingLoanBalance;
private int remainingLoanMonths;
private Double totalAccountBalance;

*/

/*
<th>Row</th>
<th onclick="sortTable(1)">Name ⬍</th>
<th>Total Investment</th>
<th>Total Loan</th>
<th>Loan Balance</th>
<th>Remaining Loan Month</th>
<th>Total Account Balance</th>
*/