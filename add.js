function add(event){
    event.preventDefault();

    const transaction = {
        id: Date.now(),
        date: document.getElementById("date-input").value,
        time: document.getElementById("time-input").value,
        title: document.getElementById("title-input").value,
        category: document.getElementById("catagory-selection").value,
        type: document.getElementById("in or out").value,
        amount: document.getElementById("amount-input").value
    };

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    window.location.href = "index.html";
}