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

//-------------------------------------------------------------
// Store UserId
let userId = "";
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
  await userDisplay();
  await loadInvestments();
  await loadloans();
})

//-------------------------------------------------------------
// User Summary function
const userData = document.getElementById('username');
const totalInvestmentElement = document.querySelector('#totalInvestment span');

let totalRemainingLoansBalance = 0

async function userDisplay() {
  try {
    const userInfo = await fetchData(`users/summary/${userId}`);

    userData.textContent = userInfo.username;

    totalInvestmentElement.textContent = userInfo.totalInvestments.toLocaleString('en-US');

    totalRemainingLoansBalance = userInfo.totalRemainingLoansBalance.toLocaleString('en-US');

  } catch (error) {
    alert("UserId not found!");
  }
} 

// link to investment details display
function investmentDetailsDisplay(){
  window.location.href = `investment-details.html?userId=${userId}`;
}

// link to loan and payment details display
function loanAndPaymentDisplay(){
  window.location.href = `loan-payment-details.html?userId=${userId}`;
}

//--------------- User Update and delete -------------
// delete User
async function deleteUser(){
  if (confirm(" آیا کاربر حذف شد!")){
    try {
      await deleteData(`users/${userId}`);
      console.log(userId);
      alert("کاربر حذف شد!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("عملیات حذف انجام نگرفت...!");
    }
  }
}

// update User
function updateUser(userId){
  const updateUserBtn = document.getElementById('updateUserBtn');
  const updateUserForm = document.getElementById('updateUserForm');


  if(updateUserForm.style.display === 'none' || updateUserForm.style.display === ''){
    updateUserForm.style.display = 'block';
    updateUserBtn.textContent = 'کنسل';
    
  }else{
    updateUserForm.style.display = 'none';
    updateUserBtn.textContent = 'ویرایش نام کاربر';
  }

  updateUserForm.onsubmit = async (e) => {
    e.preventDefault();
  
    newUser = {
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value
    }
    try {
      await updateData(`users/${userId}`, newUser);
      alert("کاربر اصلاح شد!");
      window.location.reload();
    } catch (error) {
      alert("عملیات اصلاح انجام نگرفت...!");
    }
  }
}

//--------------------- Investments ---------------------------
// add Investment
const addInvestmentBtn = document.getElementById('addInvestmentForm');
addInvestmentBtn.addEventListener('submit', async(e)=>{
  e.preventDefault();

  const investedDate = document.getElementById('investmentDate').value;
  const investedAmount = document.getElementById('investmentAmount').value;

  const newInvestment = {
    usersId: userId,
    investedDate: investedDate,
    investedAmount: investedAmount 
  }

  try {
    await postData('investment/create', newInvestment);

    window.location.reload();
    alert("مبلغ حق عضویت جدید اضافه شد!");
  } catch (error) {
    alert("UserId not found!");
  }
}) 


//----------------------------------------------------
// Load and display Investments (last 3 of them)
const investmantsListTable = document.querySelector('#investmantsListTable tbody');
investmantsListTable.innerHTML='';
async function loadInvestments(){
  try {
    const investments = await fetchData(`investment/user/${userId}`);

    investments.forEach((investment,index) => {
      if(index > investments.length -4){
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
      }
      });
    
    }
 catch (error) {
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

//--------------------- Loan ---------------------------
// Load and Display unfinished Loans
const unfinishedLoansTable = document.querySelector('#unfinishedLoansTable tbody');

const totalUnfinishedLoansElement = document.querySelector('#totalUnfinishedLoans span');

unfinishedLoansTable.innerHTML='';

async function loadloans(){
  try {
    const loans = await fetchData(`loan/user/${userId}`);
    totalUnfinishedLoansElement.textContent= totalRemainingLoansBalance;

    loans.forEach((loan,index) => {
      if(loan.remainingLoan!= 0){
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td></td> <!-- Will be dynamically numbered -->
          <td>${loan.startDate}</td>
          <td>${loan.loanAmount.toLocaleString('en-US')}</td>
          <td>${loan.durationMonths.toLocaleString('en-US')}</td>
          <td>${loan.monthlyPayment.toLocaleString('en-US')}</td>
          <td>${loan.remainingLoan.toLocaleString('en-US')}</td>
          <td>${loan.totalPayment.toLocaleString('en-US')}</td>

          <td>
            <form class="addPaymentForm" id="addPaymentForm${loan.id}">
              <input type="date" id="paymentDate${loan.id}" required>
              <input type="number" id="paymentAmount${loan.id}" min="0" placeholder="مبلغ قسط" required>

              <button type="submit"> ایجاد قسط </button>
            </form> 
          </td>
        `;
        unfinishedLoansTable.append(tr);

        //----------------------------------
        // Add Payment
        const addPaymentForm = document.getElementById(`addPaymentForm${loan.id}`);

        addPaymentForm.addEventListener('submit', async(e)=>{
          e.preventDefault();
          
          const paymentAmount = document.getElementById(`paymentAmount${loan.id}`).value;
          const paymentDate = document.getElementById(`paymentDate${loan.id}`).value;

          const newPayment = {
            loanId: loan.id,
            paymentAmount: paymentAmount,
            paymentDate: paymentDate
          }
          try {
            await postData('payment/create', newPayment);

            window.location.reload();
            alert('قسط جدید اضافه شد');
          } catch (error) {
            console.error('Failed to add payment!');
          }
          return false; // Prevents form submission and page reload
        })
      }
    });
  } catch (error) {
    console.error('Faild to load loans list');
  }
  updateRowNubmer();

}

function updateRowNubmer(){
  const rows = unfinishedLoansTable.querySelectorAll('tr');
  rows.forEach((row , index)=>{
    const numberCell = row.querySelector('td');
    numberCell.textContent = index +1;
  });
}
//----------------------------------
// Add Loans
const addLoanForm = document.getElementById('addLoanForm');
addLoanForm.addEventListener('submit', async(e)=>{
  e.preventDefault();

  const loanStartDate = document.getElementById('loanStartDate').value;
  const loanAmount = document.getElementById('loanAmount').value;
  const loanDurationMonths = document.getElementById('loanDurationMonths').value;

  const newLoan = {
    usersId: userId,
    loanAmount: loanAmount,
    startDate: loanStartDate,
    durationMonths: loanDurationMonths
  }
  try {
    await postData('loan/create', newLoan);
    window.location.reload();
    alert('وام جدید اضافه شد');
  } catch (error) {
    console.error('Failed to add loan!');
  }
})




  
/*
Difference between onclick and onsubmit:

onclick:

When it triggers: Fires when a user clicks on an element (e.g., a button, link, or any clickable HTML element).
Common use: Typically used on buttons, links, or other clickable elements.


onsubmit:

When it triggers: Fires when a form is submitted, either by clicking a submit button or pressing Enter in a form field.
Common use: Used on <form> elements to handle form validation or data submission.
*/