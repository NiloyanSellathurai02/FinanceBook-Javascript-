"use strict";

let images = ["images/icons8-edit-48.png", "images/icons8-delete-24.png"];
//Dit is de HamburgerMenu die je kan clicken
const hbMenu = document.getElementById("menu");
//Hier opent de Hamburger Menu met de Modal
const hbMenuOpen = document.getElementById("hb-menu-open");
//Hierin opent een lijst met de navigatie naar verschillende paginas
const hbModalMenuList = document.getElementById("sidebar-menulist");
const modalBG = document.getElementById("modal--menu");

//Dit is een button waarbij je administratie modal opent
const addTransactionBtn = document.getElementById("add-transaction");
//Hier gaat de Modal van de invulvelden open
const addTransactionModal = document.getElementById("add-trans");
//Deze knop sluit de modal met de invulvelden
const addTransactionModalClose = document.getElementById(
  "close-trans-modal-btn"
);

const headingTransModal = document.getElementById("heading-modal");

const editTransactionBtn = document.getElementById("edit-btn");
//Hiermee stuur je alle invulvelden met een waarde naar de server.
const submitTransactionBtn = document.getElementById("submit-btn");
///Input values overview//////////////////////////////////////
let insertDate = document.getElementById("insertDate");
let insertDescription = document.getElementById("description");
let transactionNum = document.getElementById("transaction-number");
let typeTrans = document.getElementById("type");
let editTrans = document.getElementById("editTrans");
let deleteTrans = document.getElementById("deleteTrans");
let transactionAmount = document.getElementById("amountTrans");
let revenueCalculation = document.getElementById("revenue");
let purchaseCalculation = document.getElementById("purchaseCalc");
let profitLoss = document.getElementById("profitLoss");
const profitLosStyle = document.querySelector(".profitLos");

let insertTransactions = "";
let insertName = "";
let insertTransactionNum = "";
let insertTransactionType = "";
let insertTransactionAmount = "";
let insertEditTrans = "";
let deleteTransaction = "";
let insertInput = "";

let inputDate = document.getElementById("date");
let inputCompanyName = document.getElementById("cpName");
let inputTransNumber = document.getElementById("trans-numb");
let inputAmount = document.getElementById("amount");
let inputTranscationType = document.getElementById("transaction-type");

inputDate = document.getElementById("date").value = "";
inputCompanyName = document.getElementById("cpName").value = "";
inputTransNumber = document.getElementById("trans-numb").value = "";
inputAmount = document.getElementById("amount").value = "";
inputTranscationType = document.getElementById("transaction-type").value = "";

// SET LIMIT SELECT BASED ON SEARCH QUERY VALUE
const params = new URLSearchParams(window.location.search);
params.forEach((value, key) => {
  if (key === "limit") {
    (document.getElementById(`limit-${value}`) || {}).selected = "selected";
  }
});

//Deze functie haalt de bestaande transacties op hem weer te geven
const getTransactions = () => {
  const query = location.search;
  console.log(query);
  const getReq = new XMLHttpRequest();
  getReq.open(
    "GET",
    `https://npfinance-nl.onrender.com/transactions${query}`,
    false
  );
  getReq.setRequestHeader("Content-Type", "application/json");
  getReq.send();
  const response = JSON.parse(getReq.response);
  console.log(response);

  response.transactions.forEach((trans) => {
    insertTransactions += `<div class="transaction-data-js js-transaction-date">${trans.date} </div>`;
    insertName += `<div class="transaction-data-js js-transaction-description"> ${trans.description}</div>`;
    insertTransactionNum += `<div class="transaction-data-js js-transaction-number">${trans.transaction_number}</div>`;
    insertTransactionType += `<div class="transaction-data-js js-transaction-type">${trans.type}</div>`;
    insertTransactionAmount += `<div class="transaction-data-js js-transaction-amount"> € ${trans.amount},-</div>`;
    insertEditTrans += `<div class="transaction-data-js js-transaction-edit" id="${trans._id}">
    <img src=${images[0]} alt="edit-trans" class="edit-trans"  style="pointer-events:none" /></div>`;
    deleteTransaction += `<div class="transaction-data-js js-transaction-delete"  id="${trans._id}">
    <img src=${images[1]} alt="edit-trans" class="edit-trans" style="pointer-events:none"  /></div>`;
  });

  insertDate.innerHTML = insertTransactions;
  insertDescription.innerHTML = insertName;
  transactionNum.innerHTML = insertTransactionNum;
  typeTrans.innerHTML = insertTransactionType;
  transactionAmount.innerHTML = insertTransactionAmount;
  editTrans.innerHTML = insertEditTrans;
  deleteTrans.innerHTML = deleteTransaction;

  renderPaginationButtons(response.count);
  countMoney();
};
const countMoney = () => {
  const getMoney = new XMLHttpRequest();
  getMoney.open("GET", "https://npfinance-nl.onrender.com/money", false);
  getMoney.send();
  const getMoneyRes = JSON.parse(getMoney.response);
  console.log(getMoneyRes);

  let revenue = 0;
  let purchase = 0;
  let profitloss = 0;

  getMoneyRes.forEach((calc) => {
    if (calc.type === "Income") {
      revenue += calc.amount;
    } else if (calc.type === "Purchase") {
      purchase += calc.amount;
    }
  });

  profitloss = revenue - purchase;
  let res = Math.round(profitloss * 1000) / 1000;

  console.log(revenue);
  console.log(purchase);
  revenueCalculation.innerHTML = ` € ${revenue} ,-`;
  purchaseCalculation.innerHTML = ` € ${purchase} ,-`;
  profitLoss.innerHTML = ` € ${res}`;

  if (profitloss > 0) {
    profitLosStyle.style.color = "green";
  } else if (profitloss < 0) {
    profitLosStyle.style.color = "red";
  }
};

const renderPaginationButtons = (count) => {
  const limit = Number(document.getElementById("page").value);
  const numButtons = Math.ceil(count / limit);

  let buttonHTML = "";
  for (let i = 0; i < numButtons; i++) {
    buttonHTML += `<button class="page-btn" onclick="setPage(${
      i + 1
    })" value="${i}">${i + 1}</button>`;
  }

  document.getElementById("pagination").innerHTML = buttonHTML;
};

const setPage = (pageNumber) => {
  const params = new URLSearchParams(window.location.search);
  console.log(params);
  const search = [];
  params.forEach((value, key) => {
    if (key === "page") return search.push(`page=${pageNumber}`);
    return search.push(`${key}=${value}`);
  });
  document.location.search = search.join("&");
};

const setLimit = (limit) => {
  const params = new URLSearchParams(window.location.search);
  const search = [];
  params.forEach((value, key) => {
    if (key === "limit") return search.push(`limit=${limit}`);
    if (key === "page") return search.push(`page=1`);
    return search.push(`${key}=${value}`);
  });
  document.location.search = search.join("&");

  console.log(search);
};

const toggleMenuList = () => {
  hbModalMenuList.classList.toggle("menu-toggle");
};

//Deze functie haalt alle waardes op van de invulvelden
const getInputValues = () => {
  inputDate = document.getElementById("date").value;
  inputCompanyName = document.getElementById("cpName").value;
  inputTransNumber = document.getElementById("trans-numb").value;
  inputAmount = document.getElementById("amount").value;
  inputTranscationType = document.getElementById("transaction-type").value;

  return {
    inputDate,
    inputCompanyName,
    inputTransNumber,
    inputAmount,
    inputTranscationType,
  };
};

//Deze Functie neemt alle waardes en stuurt deze naar de server
const setTransaction = () => {
  const xmhttpReq = new XMLHttpRequest();
  xmhttpReq.open(
    "POST",
    "https://npfinance-nl.onrender.com/transactions",
    false
  );
  xmhttpReq.setRequestHeader("Content-Type", "application/json");

  const values = getInputValues();

  console.log(values);

  const {
    inputDate,
    inputCompanyName,
    inputTransNumber,
    inputAmount,
    inputTranscationType,
  } = values;

  console.log(inputDate);

  xmhttpReq.send(
    JSON.stringify({
      date: inputDate,
      name: inputCompanyName,
      transaction_num: inputTransNumber,
      amount: Number(inputAmount),
      transcationType: inputTranscationType,
      image: images[0],
      deleteImage: images[1],
    })
  );
  window.location.reload();
};
getTransactions();
countMoney();
submitTransactionBtn.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
  setTransaction();
  window.location.reload();
});

hbMenu.addEventListener("click", () => {
  console.log("Menu Open");
  hbMenuOpen.classList.toggle("sidebar--toggle");
  modalBG.classList.toggle("modal-menu");
  toggleMenuList();
});

addTransactionBtn.addEventListener("click", () => {
  console.log("Add Tranaction Button Worked");
  addTransactionModal.classList.toggle("add-trans-visible");
});

addTransactionModalClose.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
});

deleteTrans.addEventListener("click", (e) => {
  console.log(e.target.id);
  const deleteTrans = new XMLHttpRequest();
  deleteTrans.open(
    "delete",
    `https://npfinance-nl.onrender.com/transactions/${e.target.id}`,
    false
  );
  deleteTrans.send();
  window.location.reload();
});

editTrans.addEventListener("click", (e) => {
  console.log(e.target.id);
  addTransactionModal.classList.toggle("add-trans-visible");
  editTransactionBtn.style.display = "block";
  submitTransactionBtn.style.display = "none";
  headingTransModal.innerText = "Edit Transaction";

  const editingTrans = new XMLHttpRequest();
  editingTrans.open(
    "get",
    `https://npfinance-nl.onrender.com/transactions/${e.target.id}`,
    false
  );
  editingTrans.send();
  const response = JSON.parse(editingTrans.response);
  console.log(response);

  inputDate.value = response.date;
  inputCompanyName.value = response.description;
  inputTransNumber.value = response.transaction_number;
  inputAmount.value = response.amount;
  inputTranscationType.value = response.type;

  editTransactionBtn.setAttribute("rel", response._id);
});

editTransactionBtn.addEventListener("click", (e) => {
  const dates = inputDate.value;
  const compyNM = inputCompanyName.value;
  const transNum = inputTransNumber.value;
  const amount = inputAmount.value;
  const type = inputTranscationType.value;

  console.log(dates);

  console.log(dates);
  console.log("EDITING NOW.....................");
  const sendChanges = new XMLHttpRequest();
  sendChanges.open(
    "PATCH",
    `https://npfinance-nl.onrender.com/transactions/${e.target.getAttribute(
      "rel"
    )}`,
    false
  );
  sendChanges.setRequestHeader("Content-Type", "application/json");

  sendChanges.send(
    JSON.stringify({
      dates: dates,
      descriptions: compyNM,
      transaction_numbers: transNum,
      amounts: amount,
      types: type,
    })
  );
  addTransactionModal.classList.remove("add-trans-visible");
  window.location.reload();
});
