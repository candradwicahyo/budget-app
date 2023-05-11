window.addEventListener('DOMContentLoaded', () => {
  
  let budget = 0, tasks = [];
  
  const totalBudget = document.querySelector('.total-budget');
  const expenses = document.querySelector('.expenses');
  const balance = document.querySelector('.balance');
  
  const inputBudget = document.querySelector('.input-budget');
  const buttonBudget = document.querySelector('.button-budget');
  buttonBudget.addEventListener('click', addBudget);
  
  function addBudget(event) {
    event.preventDefault();
    const value = inputBudget.value.trim();
    if (validateInteger(value)) {
      budget = Number(value);
      setLocalstorage('budget', budget);
      showBudget();
      alerts('success', 'Budget has been added');
      getBalance();
      clear();
    }
  }
  
  function validateInteger(value) {
    if (!value) return alerts('error', 'Input budget is empty!');
    if (value.match(/[a-zA-Z]/gi)) return alerts('error', 'budget should be number!');
    if (value.match(/\s/gi)) return alerts('error', 'don\'t enter budget with spaces!');
    return true;
  }
  
  function alerts(icon, text) {
    swal.fire ({
      icon: icon,
      title: 'Alert',
      text: text
    });
  }
  
  function setLocalstorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  
  function showBudget() {
    const data = localStorage.getItem('budget');
    budget = (data) ? data : 0;
    setValue();
  }
  
  showBudget();
  
  function setValue() {
    totalBudget.textContent = budget;
    balance.textContent = budget;
  }
  
  function clear() {
    const forms = document.querySelectorAll('.form-wrapper');
    forms.forEach(form => form.reset());
  }
  
  const listContainer = document.querySelector('.list-container');
  const inputItem = document.querySelector('.input-item');
  const inputPriceItem = document.querySelector('.input-price');
  const buttonSubmit = document.querySelector('.button-submit');
  buttonSubmit.addEventListener('click', function(event) {
    event.preventDefault();
    if (this.textContent.toLowerCase().includes('add')) {
      const item = inputItem.value.trim();
      const priceItem = inputPriceItem.value.trim();
      const data = { item: item, price: priceItem };
      if (validateString(item) && validateInteger(priceItem)) {
        if (isDataExist(data)) return alerts('error', 'Data is already exist!');
        tasks.unshift(data);
        setLocalstorage('item', tasks);
        showUI(data);
        alerts('success', 'New item has been added');
        getBalance();
        showItem();
        clear();
      }
    }
  });
  
  function validateString(item) {
    if (!item) return alerts('error', 'Input name item is empty!');
    if (item.length > 15) return alerts('error', 'Field name item must be no more than 15 character!');
    return true;
  }
  
  function isDataExist({ item, price }) {
    let exist = false;
    tasks.forEach(task => {
      if (task.item.toLowerCase() == item.toLowerCase() && task.price == price) exist = true;
      if (task.item.toLowerCase() == item.toLowerCase() && task.price != price) exist = false;
    });
    return exist;
  }
  
  function getBalance() {
    const expense = tasks.map(task => Number(task.price)).reduce((acc, num) => acc += num, 0);
    const totalBalance = budget - expense;
    expenses.textContent = expense;
    balance.textContent = totalBalance;
  }
  
  function showUI(data, index = 0) {
    const result = renderElement(data, index);
    listContainer.insertAdjacentHTML('beforeend', result);
  }
  
  function showItem() {
    listContainer.innerHTML = '';
    const data = localStorage.getItem('item');
    tasks = (data) ? JSON.parse(data) : [];
    tasks.forEach((task, index) => {
      showUI(task, index);
      getBalance();
    });
  }
  
  showItem();
  
  function renderElement({ item, price }, index) {
    return `
      <div class="list">
        <span>${item}</span>
        <span>${price}</span>
        <div class="icon-wrapper">
          <i class="fa-solid fa-pencil button-edit" data-index="${index}"></i>
          <i class="fa-solid fa-trash-alt button-delete" data-index="${index}"></i>
        </div>
      </div>
    `;
  }
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('button-delete')) {
      const index = event.target.dataset.index;
      deleteItem(index);
    }
  });
  
  function deleteItem(index) {
    swal.fire ({
      icon: 'info',
      title: 'are you sure?',
      text: 'do you want to delete this data?',
      showCancelButton: true
    })
    .then(response => {
      if (response.isConfirmed) {
        tasks.splice(index, 1);
        setLocalstorage('item', tasks);
        showItem();
        alerts('success', 'Item has been deleted!');
        getBalance();
      }
    });
  }
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('button-edit')) {
      const index = event.target.dataset.index;
      buttonSubmit.textContent = 'Edit item';
      inputItem.value = tasks[index].item;
      inputPriceItem.value = tasks[index].price;
      editItem(index);
    }
  });
  
  function editItem(index) {
    buttonSubmit.addEventListener('click', function(event) {
      event.preventDefault();
      if (this.textContent.toLowerCase().includes('edit')) {
        const item = inputItem.value.trim();
        const priceItem = inputPriceItem.value.trim();
        const data = { item: item, price: priceItem };
        if (validateString(item) && validateInteger(priceItem)) {
          if (isDataExist(data)) return alerts('error', 'Data is already exist!');
          tasks[index].item = item;
          tasks[index].price = priceItem;
          setLocalstorage('item', tasks);
          showItem();
          getBalance();
          alerts('success', 'Item has been updated!');
          clear();
          buttonSubmit.textContent = 'Add item';
          index = null;
        }
      }
    }); 
  }
  
  const buttonDeleteBudget = document.querySelector('.button-delete-budget');
  buttonDeleteBudget.addEventListener('click', deleteBudget);
  
  function deleteBudget(event) {
    event.preventDefault();
    budget = 0;
    setLocalstorage('budget', budget);
    showBudget();
    alerts('success', 'Budget has been deleted!');
    getBalance();
  }
  
});