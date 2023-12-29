function calcpriceProduct(prodname) {
    var quant = document.querySelector(`td .prod-quant ${prodname} div input`).value;
    var price = Number(document.querySelector(`td.prod-price ${prodname}`).innerHTML);
    var totalDisplay = document.querySelector(`td.prod-total ${prodname}`);
    totalDisplay.innerHTML = quant * price;
}