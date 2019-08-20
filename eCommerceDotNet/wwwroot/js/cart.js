// requesting API to load cart
async function loadCart() {
  console.log("LoadNew")
  var result = await fetch('http://localhost:5000/getCartItems', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'userID': 'Xyz123'
        }
    });
  console.log(result);
  let response = await result.text();
  let productsList = JSON.parse(response);
  generateCartList(productsList)
}
// requesting API to remove cart items
async function removeCartItem(productId){
  console.log(productId)
  data = {productID: productId}
  var result = await fetch('http://localhost:5000/removeCartItem', {
      method: 'POST',
      mode: 'cors',
      body:JSON.stringify(data),
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'userID': 'Xyz123'
      }
    });
  console.log(result);
  let response = await result.text();
  let productsList = JSON.parse(response);
  generateCartList(productsList)
}
// requesting API to update cart
async function updateProductQuantity(quantity,productID){
	data = { quantity: quantity, productID: productID}
  console.log(data)
  var result = await fetch('http://localhost:5000/UpdateQuantity', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body:JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'userID': 'Xyz123'
        }
    });
  console.log(result);
  let response = await result.text();
  let productsList = JSON.parse(response);
  generateCartList(productsList)
}
// generating the UI to create the cart
function generateCartList(productsList){
  $("#table_body").html('');
  let table = $(".cart-table table")
  productsList['items'].forEach(product => {
    console.log(product)
     var NewProduct = $(`
      <tr id="cart_Product_${product.productID}">
        <td class="card_product_image" data-th="Image"><a href="#"><img src="${product.imgurl}" alt="Image"></a></td>
        <td class="card_product_name" data-th="Product Name"><a href="#">${product.name}</a></td>
        <td class="card_product_quantity" data-th="Quantity"><input type="number" onChange="updateProductQuantity(this.value,'${product.id}');" min="0" value=${product._collection} name="" class="styler">
          &nbsp;
          &nbsp;<a onclick="removeCartItem('${product.id}')" href="#"><i class="icon-trash icon-large"></i> </a>
        </td>
        <td class="card_product_total" data-th="Total">$ ${product.offer_price}</td>
      </tr>
    `);
    NewProduct.appendTo($('#table_body'));
  })
  console.log(productsList['total']['sub_total'])
  $('#hst_cost').html("$ "+productsList['total']['hst']);
  $('#sub_total_cost').html("$ "+productsList['total']['sub_total']);
  console.log(productsList['total']['hst'])
  
  $('#total_cost').html("$ "+productsList['total']['total']);
}
loadCart()

