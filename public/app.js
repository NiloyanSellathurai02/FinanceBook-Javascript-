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
  getReq.open("GET", `http://localhost:8000/findtransactions${query}`, false);
  getReq.setRequestHeader("Content-Type", "application/json");
  getReq.send();
  const response = JSON.parse(getReq.response);
  console.log(response);

  let insertTransactions = "";
  let insertName = "";
  let insertTransactionNum = "";
  let insertTransactionType = "";
  let insertTransactionAmount = "";
  let insertEditTrans = "";
  let deleteTransaction = "";
  response.transactions.forEach((trans) => {
    insertTransactions += `<div class="transaction-data-js js-transaction-date">${trans.date} </div>`;
    insertName += `<div class="transaction-data-js js-transaction-description"> ${trans.description}</div>`;
    insertTransactionNum += `<div class="transaction-data-js js-transaction-number">${trans.transaction_number}</div>`;
    insertTransactionType += `<div class="transaction-data-js js-transaction-type">${trans.type}</div>`;
    insertTransactionAmount += `<div class="transaction-data-js js-transaction-amount"> € ${trans.amount},-</div>`;
    insertEditTrans += `<div class="transaction-data-js js-transaction-edit">
    <img src=${images[0]} alt="edit-trans" class="edit-trans" /></div>`;
    deleteTransaction += `<div class="transaction-data-js js-transaction-delete">
    <img src=${images[1]} alt="edit-trans" class="edit-trans" /></div>`;
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
  getMoney.open("GET", "http://localhost:8000/getmoney", false);
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

getTransactions();

//Deze functie haalt alle waardes op van de invulvelden
const getInputValues = () => {
  const inputDate = document.getElementById("date").value;
  const inputCompanyName = document.getElementById("cpName").value;
  const inputTransNumber = document.getElementById("trans-numb").value;
  const inputAmount = document.getElementById("amount").value;
  const inputTranscationType =
    document.getElementById("transaction-type").value;

  console.log(inputDate);
  console.log(inputCompanyName);
  console.log(inputTransNumber);
  console.log(inputAmount);
  console.log(inputTranscationType);

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
  xmhttpReq.open("POST", "http://localhost:8000/bills", false);
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
};

countMoney();
submitTransactionBtn.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
  setTransaction();
  getTransactions();
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
