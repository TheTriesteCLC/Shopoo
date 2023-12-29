function calcpriceProduct() {
    var quant = document.querySelector('td .prod-quant div input').value;
    var price = Number(document.querySelector('td.prod-price').innerHTML);
    return quant * price;
}