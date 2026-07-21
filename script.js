function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


let editingId = null;
function renderTransactions(transactions = getTransactions()) {
    const table = document.getElementById("table");

    table.querySelectorAll("tr:not(#table-header)").forEach(row => row.remove());

    transactions.forEach(transaction => {
        const row = document.createElement("tr");

        const color = transaction.type === "income" ? "green" : "red";

    row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.time}</td>
        <td>${transaction.title}</td>
        <td>${transaction.category}</td>
        <td style="color: ${color}; font-weight: bold;">
            ${transaction.amount} etb
        </td>
    `;

        const buttonsCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.onclick = function () {
            openEditForm(transaction.id);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
       deleteBtn.onclick=function(){

    if(confirm("Delete this transaction?")){
        deleteTransaction(transaction.id);
    }

}

        buttonsCell.appendChild(editBtn);
        buttonsCell.appendChild(deleteBtn);
        row.appendChild(buttonsCell);

        table.appendChild(row);
    });

    updateTotals(transactions);
}


function updateTotals(transactions) {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        const amount = Number(transaction.amount) || 0;
        if (transaction.type === "income") {
            income += amount;
        } else if (transaction.type === "expense") {
            expense += amount;
        }
    });

    const total = income - expense;

    document.getElementById("income-balance").textContent = income + " etb";
    document.getElementById("expense-balance").textContent = expense + " etb";
    document.getElementById("total-balance").textContent = total + " etb";
}


function deleteTransaction(id) {
    const transactions = getTransactions().filter(t => t.id !== id);
    saveTransactions(transactions);
    renderTransactions();
}


function openEditForm(id) {
    const transaction = getTransactions().find(t => t.id === id);
    if (!transaction) return;

    editingId = id;

    document.getElementById("edit-date-input").value = transaction.date;
    document.getElementById("edit-title-input").value = transaction.title;
    document.getElementById("edit-catagory-selection").value = transaction.category;
    document.getElementById("edit-in-or-out").value = transaction.type;
    document.getElementById("edit-amount-input").value = transaction.amount;

    document.getElementById("dashboard2").style.display = "flex";
}

function saveEdit() {
    if (editingId === null) return;

    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === editingId);
    if (index === -1) return;

    transactions[index] = {
        id: editingId,
        date: document.getElementById("edit-date-input").value,
        title: document.getElementById("edit-title-input").value,
        category: document.getElementById("edit-catagory-selection").value,
        type: document.getElementById("edit-in-or-out").value,
        amount: document.getElementById("edit-amount-input").value
    };

    saveTransactions(transactions);
    editingId = null;
    document.getElementById("dashboard2").style.display = "none";
    renderTransactions();
}

function cancelEdit() {
    editingId = null;
    document.getElementById("dashboard2").style.display = "none";
}

window.onload = function () {
    renderTransactions();
};

function filtertransactions(type){
    let transactions = getTransactions();
   
    if(type==="all"){
        renderTransactions(transactions)
        return
    }
    else if (type === "inc"){
        transactions = transactions.filter(
            t=>t.type === "income"
        )
    }

    else if( type=== "exp"){
        transactions=transactions.filter(
            t=>t.type==="expense"
        )
    }
    renderTransactions(transactions);
}

function searching(){
    let search=document.getElementById("search").value.toLowerCase();
    let transactions=getTransactions()
    transactions=transactions.filter(function(transaction){
        return(
            transaction.title.toLowerCase().includes(search)||
            transaction.category.toLowerCase().includes(search)||
            transaction.date.toLowerCase().includes(search)||
            transaction.amount.toString().includes(search)

        );

    })
    renderTransactions(transactions)
}
  
function setActive(buttonId){

    const buttons = document.querySelectorAll("#filter button");

    buttons.forEach(function(button){
        button.classList.remove("active");
    });

    document.getElementById(buttonId).classList.add("active");

}
