const transactonsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'));
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = ID => {
  transactions = transactions
    .filter( transaction => transaction.id !== ID);
  updateLocalStorage();
  init();

} 
const addTransactionIntoDOM = ({id, name, amount}) => {
  const operator = amount < 0 ? '-' : '+';
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `;
  transactonsUl.append(li);
}
const getExpenses = transactonsAmounts => Math.abs(transactonsAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value,0))
  .toFixed(2);

const getIncome = transactonsAmounts => transactonsAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2);

const getTotal = transactonsAmounts => transactonsAmounts
  .reduce((accumulator, transaction) => accumulator + transaction,0)
  .toFixed(2);

const updateBalanceValues = () => {
  const transactonsAmounts = transactions.map(({amount}) => amount);
  const total = getTotal(transactonsAmounts); 
  const income = getIncome(transactonsAmounts);
  const expense = getExpenses(transactonsAmounts);
  
  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
}
const init  = () => {
  transactonsUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
}
init();

const updateLocalStorage = () => 
  localStorage.setItem('transactions', JSON.stringify(transactions));

const generateID = () => Math.round(Math.random() * 1000);

const clearInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
}

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount : Number(transactionAmount)
  });
} 

const handleFormSubmit = event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty =  transactionName === '' || transactionAmount === '';

  if(isSomeInputEmpty) {
    alert('Preencha os campos corretamente!');
    return;
  }
  addToTransactionsArray(transactionName,transactionAmount); 
  init();
  updateLocalStorage();
  clearInputs();
  
}
form.addEventListener('submit', handleFormSubmit);