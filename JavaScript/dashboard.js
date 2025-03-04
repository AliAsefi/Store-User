if (localStorage.getItem("loginKey") !== "true") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("loginKey");
  window.location.href = "login.html";
}

const tableElement = document.getElementById('summarytable');

document.addEventListener("DOMContentLoaded",async()=>{
  const tbodyElement = document.getElementById('tbody');
  const thead = document.getElementById('thead');

  let totalInvestments = 0;
  let totalLoans = 0;
  let totalRemainingLoansBalance = 0;
  let totalAccountsBalance = 0;

  try{
    const users = await fetchData("users/summary/all");

      const headers = ['ردیف','نام','حق عضویت','باقیمانده وام','موجودی'];  
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
        window.location.href = `users-data.html?userId=${user.userId}`;
      })
      tr.innerHTML =`
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.totalInvestments.toLocaleString('en-US')}<br>
        <td>${user.totalRemainingLoansBalance.toLocaleString('en-US')}</td>
        <td>${user.totalAccountsBalance.toLocaleString('en-US')}</td>
      `
      totalInvestments += user.totalInvestments;
      totalLoans+= user.totalLoans;
      totalRemainingLoansBalance += user.totalRemainingLoansBalance;
      totalAccountsBalance += user.totalAccountsBalance;

      tbodyElement.appendChild(tr);
    });

  //Update General Information Table After Calculation
  const infoTable = document.querySelector('#info tbody'); 
  infoTable.innerHTML = `
      <tr>
        <td>${totalInvestments.toLocaleString('en-US')}</td>
        <td>${totalRemainingLoansBalance.toLocaleString('en-US')}</td>
        <td>${totalAccountsBalance.toLocaleString('en-US')}</td>
      </tr>
      `;

  }catch(error){
    console.error("Error loading users:", error);
  }
});

// ------------------- Add new user---------------------
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
    alert("عضو جدید اضافه شد");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error adding user: ", error);
    alert("عضو جدید اضافه نشد! دوباره تلاش کنید...")
  }
})

// Track sorting state for each column
let sortOrder = {};

function sortTable(columnIndex) {
  const table = document.querySelector("summarytable tbody");
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

/*
function fillterTable(){
  const searchInput = document.getElementById("searchInput").value;
  const rows = document.querySelectorAll('#tbody tr');

  rows.forEach(row =>{
    const username = row.cells[1].textContent.toLowerCase();
    row.style.display = username.includes(searchInput) ? '' : 'none';
  })
}
  */