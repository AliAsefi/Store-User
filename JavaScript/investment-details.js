if (localStorage.getItem("loginKey") !== "true") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("loginKey");
  window.location.href = "login.html";
}

function goBack(){
  window.location.href = "dashboard.html";
}

function goBackToPage(){
  window.location.href = `users-data.html?userId=${userId}`;}

//-------------------------------------------------------------
// Store UserId
let userId = [];
document.addEventListener('DOMContentLoaded', async(e)=>{
  e.preventDefault;

  userId = new URLSearchParams (window.location.search).get('userId');

  if(!userId){
    alert("User ID not found!");
    window.location.reload;
    window.location.href = "dashboard.html";
    return;
  }

  //Load all Section
  userDisplay();
  loadInvestments();

})

// User Summary function
const userData = document.getElementById('username');
const totalInvestmentElement = document.querySelector('#totalInvestment span');

async function userDisplay() {
  try {
    const userInfo = await fetchData(`users/summary/${userId}`);
    userData.textContent = userInfo.username;

    totalInvestmentElement.textContent = userInfo.totalInvestments.toLocaleString('en-US');

  } catch (error) {
    alert("UserId not found!");
  }
} 

//----------------------------------------------------
// Load and display Investments
const investmantsListTable = document.querySelector('#investmantsListTable tbody');
investmantsListTable.innerHTML='';
async function loadInvestments(){
  try {
    const investments = await fetchData(`investment/user/${userId}`);

    investments.forEach((investment,index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${investments.length - index}</td>
        <td>${investment.investedDate.toLocaleString('en-US')}</td>
        <td>${investment.investedAmount.toLocaleString('en-US')}</td>
        <td>
          <button id="deleteInvestmentBtn" onclick="deleteInvestmentBtn(${investment.id})">حذف حق عضویت</button>
        </td>
      `;
      investmantsListTable.prepend(tr);
    });
  } catch (error) {
    console.error('Faild to load investments list');
  }
}

//-------------------------------
// Delete Investment
async function deleteInvestmentBtn(investmentId){
  if (confirm("مبلغ حق عضویت پاک شود؟")){
    try {
      await deleteData(`investment/${investmentId}`);
  
      alert("مبلغ حق عضویت حذف شد!");
      window.location.reload();
    } catch (error) {
      console.error('Faild to load investments list');
    }
  }
}





