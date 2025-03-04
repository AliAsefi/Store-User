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
let userId = '';
document.addEventListener('DOMContentLoaded', async(e)=>{
  e.preventDefault();

  userId = new URLSearchParams (window.location.search).get('userId');

  if(!userId){
    alert("User ID not found!");
    window.location.href = "dashboard.html";
    return;
  }

  //Load all Section
  userDisplay();
  loadUnfinishedLoansTable();
})

// User Summary function
const userData = document.getElementById('username');
const totalInvestmentElement = document.querySelector('#totalInvestment span');

async function userDisplay() {
  try {
    const userInfo = await fetchData(`users/summary/${userId}`);
    userData.textContent = userInfo.username;

  } catch (error) {
    alert("UserId not found!");
    window.location.href = "dashboard.html";
  }
} 

//----------------------------------------------------
// loansDisplayBtn button
function loansDisplayBtn(){
  const btn = document.getElementById('loansDisplayBtn');
  const title = document.getElementById('title');

  loanAndPaymentContainer.innerHTML = "";

  if (btn.value == 'allLoan'){
    btn.textContent = 'مشاهده وام های ناتمام';
    title.textContent = 'لیست تمام وام ها';
    btn.value = 'unfinishedLoan'
    loadAllLoansTable();
  }else{
    btn.textContent = 'مشاهده تمام وام ها';
    title.textContent = 'لیست وام های ناتمام و پرداخت های انجام شده';
    btn.value='allLoan';
    loadUnfinishedLoansTable();
  }
}

//------------------------------------------------------------------
// deleteLoan button
async function deleteLoan(loanId){
  if (confirm("مبلغ وام پاک شود؟")){
    try {
      await deleteData(`loan/${loanId}`);
      alert("مبلغ وام حذف شد!");
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete loan');
    }
  }
}

//---------------------------
// updateLoan button
async function updateLoanForm(loanId){
  const updateLoanBtn = document.getElementById(`updateLoanBtn-${loanId}`);
  const loanUpdateForm = document.getElementById(`form-${loanId}`);

  if(updateLoanBtn.value === 'close'){
    updateLoanBtn.value = 'open';
    updateLoanBtn.textContent = 'بستن فرم';
    loanUpdateForm.style.display = 'block';
  }else{
    updateLoanBtn.value = 'close';
    updateLoanBtn.textContent = 'فرم اصلاح وام';
    loanUpdateForm.style.display = 'none';
  }
  
    loanUpdateForm.onsubmit = async (e) => {
      e.preventDefault();

    const updatedLoanStartDate = document.getElementById(`updatedLoanStartDate-${loanId}`).value;
    const updatedLoanAmount = document.getElementById( `updatedLoanAmount-${loanId}`).value;
    const updatedLoanDurationMonths = document.getElementById(`updatedLoanDurationMonths-${loanId}`).value;

    const updatedLoan = {
      usersId: userId, 
      loanAmount: updatedLoanAmount,
      startDate: updatedLoanStartDate,
      durationMonths: updatedLoanDurationMonths
    };
    try {
      await updateData(`loan/${loanId}`, updatedLoan);
      alert(" وام اصلاح شد!");
      window.location.reload();
    } catch (error) {
      console.error('Failed to update loan');
    }
  }
}

//----------------------------------------------------
// Load and Display unfinished Loans
const loanAndPaymentContainer = document.querySelector('#loanAndPaymentContainer');
async function loadUnfinishedLoansTable() {
  try {
    const loans = await fetchData(`loan/user/${userId}`);
    
    loans.forEach(loan => {
      const container = document.createElement("div");
      const loanContainer = document.createElement('div');
      loanContainer.id = `loanContainer-${loan.id}`;
      
      if (loan.remainingLoan !== 0) {
        const tableHtml = `
          <table class= "loanTable">
            <thead>
              <tr>
                <th>تاریخ شروع</th>
                <th>مبلغ وام</th>
                <th>تعداد ماه بازپرداخت</th>
                <th>تغییرات</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${loan.startDate}</td>
                <td>${loan.loanAmount.toLocaleString('en-US')}</td>
                <td>${loan.durationMonths}</td>
                <td>
                    <button id="deleteLoanBtn" onclick="deleteLoan(${loan.id})">حذف وام</button>
                    <button id="updateLoanBtn-${loan.id}" value="close" onclick="updateLoanForm(${loan.id})">
                    فرم اصلاح وام</button>
                </td>
              </tr>
            </tbody>
          </table><br>
          <h3>لیست پرداخته های مربوط به وام</h3>
          <form id="form-${loan.id}" style="display: none;">
            <input type="date" id="updatedLoanStartDate-${loan.id}" required>
            <input type="number" id="updatedLoanAmount-${loan.id}" min="0" placeholder="مبلغ وام" required>
            <input type="number" id="updatedLoanDurationMonths-${loan.id}" min="0" placeholder="تعداد ماه بازپرداخت" required>

            <button type="submit">اصلاح وام</button>
          </form>
        `;

        loanContainer.innerHTML = tableHtml;
        container.appendChild(loanContainer);
        loanAndPaymentContainer.appendChild(container);


        // Create a container for payments table
        const paymentsContainer = document.createElement('div');
        paymentsContainer.id = `paymentsContainer-${loan.id}`;
        //paymentsContainer.innerHTML = `<p>در حال بارگذاری پرداخت ها...</p>`;

        container.appendChild(paymentsContainer);

        // Load payments for the loan
        loadPaymentsForLoan(loan.id, paymentsContainer);
      }
    });
  } catch (error) {
    console.error('Failed to load loans list', error);
  }
}

//----------------------------------------------------
// Load and Display all Loans
async function loadAllLoansTable() {
  try {
    const loans = await fetchData(`loan/user/${userId}`);
    
    loans.forEach(loan => {
      const container = document.createElement("div");
      const loanContainer = document.createElement('div');
      loanContainer.id = `loanContainer-${loan.id}`;
      
        const tableHtml = `
          <table class= "loanTable">
            <thead>
              <tr>
                <th>تاریخ شروع</th>
                <th>مبلغ وام</th>
                <th>تعداد ماه بازپرداخت</th>
                <th>تغییرات</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${loan.startDate}</td>
                <td>${loan.loanAmount.toLocaleString('en-US')}</td>
                <td>${loan.durationMonths}</td>
                <td>
                    <button id="deleteLoanBtn" onclick="deleteLoan(${loan.id})">حذف وام</button>
                    <button id="updateLoanBtn-${loan.id}" value="close" onclick="updateLoanForm(${loan.id})">
                    فرم اصلاح وام</button>
                </td>
              </tr>
            </tbody>
          </table>
          <br>
          <form id="form-${loan.id}" style="display: none;">
            <input type="date" id="updatedLoanStartDate-${loan.id}" required>
            <input type="number" id="updatedLoanAmount-${loan.id}" min="0" placeholder="مبلغ وام" required>
            <input type="number" id="updatedLoanDurationMonths-${loan.id}" min="0" placeholder="تعداد ماه بازپرداخت" required>

            <button type="submit">اصلاح وام</button>
          </form>
          <br>
        `;

        loanContainer.innerHTML = tableHtml;
        container.appendChild(loanContainer);
        loanAndPaymentContainer.appendChild(container);


        // Create a container for payments table
        const paymentsContainer = document.createElement('div');
        paymentsContainer.id = `paymentsContainer-${loan.id}`;
        //paymentsContainer.innerHTML = `<p>در حال بارگذاری پرداخت ها...</p>`;

        container.appendChild(paymentsContainer);

        // Load payments for the loan
        loadPaymentsForLoan(loan.id, paymentsContainer);
    });
  } catch (error) {
    console.error('Failed to load loans list', error);
  }
}

//---------------------------
// deletePayment button
async function deletePayment(paymentId){
  if (confirm("مبلغ پرداخت پاک شود؟")){
    try {
      await deleteData(`payment/${paymentId}`);
      alert("مبلغ پرداخت حذف شد!");
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete loan');
    }
  }
}

//---------------------------
// updatePayment button
function updatePayment(paymentId , loanId){
  const updatePaymentBtn = document.getElementById(`updatePaymentBtn-${paymentId}`);
  const updateFormRow = document.getElementById(`updateFormRow-${paymentId}`);
  const paymentUpdateForm = document.getElementById(`payment-form-${paymentId}`);


  if(updatePaymentBtn.value === 'close'){
    updatePaymentBtn.value = 'open';
    updatePaymentBtn.textContent = 'بستن فرم';
    updateFormRow.style.display = 'block';
  }else{
    updatePaymentBtn.value = 'close';
    updatePaymentBtn.textContent = 'فرم اصلاح پرداخت';
    updateFormRow.style.display = 'none';
  }
  
  paymentUpdateForm.onsubmit = async (e) => {
      e.preventDefault();

    const updatedPaymentDate = document.getElementById(`updatedPaymentDate-${paymentId}`).value;
    const updatedPaymentAmount = document.getElementById( `updatedPaymentAmount-${paymentId}`).value;

    const updatedPayment = {
      loanId: loanId, 
      paymentAmount: updatedPaymentAmount,
      paymentDate: updatedPaymentDate,
    };

    try {
      await updateData(`payment/${paymentId}`, updatedPayment);
      alert(" پرداخت اصلاح شد!");
      window.location.reload();
    } catch (error) {
      console.error('Failed to update loan');
    }
  }
}

// Function to fetch and display payments for a specific loan
async function loadPaymentsForLoan(loanId, container) {
  try {
    const payments = await fetchData(`payment/user/${userId}/${loanId}`);

    if (payments.length === 0) {
      container.innerHTML = `<h3>پرداختی برای این وام وجود ندارد</h3>`;
      return;
    }

    // Create payments table
    const paymentsTable = document.createElement('table');
    paymentsTable.className='paymentTable';
    paymentsTable.innerHTML = `
      <thead>
        <tr>
          <th>تاریخ پرداخت</th>
          <th>مبلغ پرداخت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map(payment => `
          <tr>
            <td>${payment.paymentDate}</td>
            <td>${payment.paymentAmount.toLocaleString('en-US')}</td>
            <td>
              <button id="deletePaymentBtn" onclick="deletePayment(${payment.id})">حذف پرداخت</button>
              <button id="updatePaymentBtn-${payment.id}" value="close" onclick="updatePayment(${payment.id},${loanId})">فرم اصلاح پرداخت</button>
            </td>
          </tr>
          <tr id="updateFormRow-${payment.id}" style="display: none;">
            <td>
              <div class="update-form-container" id="paymentFormContainer-${payment.id}">
                <form id="payment-form-${payment.id}">
                  <input type="date" id="updatedPaymentDate-${payment.id}" required>
                  <input type="number" id="updatedPaymentAmount-${payment.id}" min="0" placeholder="مبلغ پرداخت" required>
                  <button type="submit">اصلاح پرداخت</button>
                </form>
              </div>
            </td>
          </tr>
        </tbody>
      `).join('')}
    `;


    // Append payments table under the loan table
    container.innerHTML = ''; // Clear loading text
    container.appendChild(paymentsTable);
  } catch (error) {
    console.error(`Failed to load payments for loan ${loanId}`, error);
  }
}