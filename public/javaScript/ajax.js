function changeQuantity(proId, count) {
    $.ajax({
        url: '/changeProductQuantity',
        data: {
            proId: proId,
            count: count
        },
        method: 'POST',
        success: (response) => {
            if (response.status) {
                let countbox = parseInt($('#quantityDisplay' + proId).val())
                countbox = countbox + count
 
                $('#quantityDisplay' + proId).val(countbox)

                if (countbox === 1) {
                    $('#reduce-btn' + proId).addClass('d-none')
                } else {
                    $('#reduce-btn' + proId).removeClass('d-none')
                }

                let price = $('#productPrice' + proId).html().replace(/^\D+/g, '')
                price = parseInt(price)
                console.log(price)
                console.log(countbox)
                console.log(countbox * price)
                $('#productTotal' + proId).html('₹' + (countbox * price))

                let totalCartPrice = $('#totalCartPrice').html().replace(/^\D+/g, '')
                totalCartPrice = parseInt(totalCartPrice)
                totalCartPrice = totalCartPrice + (count * price)
                $('#totalCartPrice').html('₹' + totalCartPrice)

                if(totalCartPrice>500){
                    $('#shippingCharge').html('₹0')
                    $('#fullTotal').html('₹'+totalCartPrice)
                }else{
                    $('#shippingCharge').html('₹50')
                    $('#fullTotal').html('₹'+(totalCartPrice+50))

                }


            }
        }
    })
}

function removeFromCart(proId){
    $.ajax({
        url: '/removeFromCart',
        data: {
            proId: proId
        },
        method: 'POST',
        success: (response)=>{
            if(response.status){
                location.reload()
            }
        }
    })
}

$('#placeOrderForm').submit((e)=>{
    e.preventDefault() 
    $.ajax({
        url:'/placeOrder',
        method: 'post',
        data: $('#placeOrderForm').serialize(),
        success: (response) => {
            if (response.paymentOrAddress == false) {
                $('#paymentOrAddressMsg').removeClass('d-none')
            }
            if (response.codSuccess) {
                location.href = '/confirmation'
            } else if (response.status) {
                razorPayment(response)
            }
        }

    })
})

function razorPayment(order) {
    var options = {
        'key': 'rzp_test_7ACCY6CqD2y8m1',
        'amount': order.amount,
        'currency': 'INR',
        'name': 'shopec',
        'description': 'shop ec book shop',
        'order_id': order.id,
        'handler': (response) => {
            verifyPayment(response, order)
        },
        'prefill': {
            'name': 'user',
            'contact': '9999999999',
            'email': 'user@gmail.com'
        },
        'notes': {
            'address': 'Razorpay Corporate Office'
        },
        'theme': {
            'color': '#F37254'
        }
    }
    var rzp1 = new Razorpay(options)
    rzp1.open()
}

function verifyPayment(payment, order) {
    $.ajax({
        url: '/verifyPayment',
        data: {
            payment,
            order
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                console.log(response.status);
                location.href = '/confirmation'
            } else {
                alert('payment failed')
            }
        }
    })
}  
function addToWishlist(proId) {
    $.ajax({
        url:'/addToWishlist',
        data: {
            proId: proId,
        },
        method:'POST',
        success:(response)=>{
            if(response.alreadyExist){
                swal("Product already in wishlist")  
            }else if(!response.userLogged){
                location.href = '/login'
            }
            else
            {
                swal("", "Product added to wishlist", "success")
            }
            // if(!response.userLogged){
            //     location.href = '/login' 
            // }
        }
    })
}
function removeWishlist(proId){
    $.ajax({
        url: '/removeFromWishlist',
        data: {
            proId: proId
        },
        method: 'POST',
        success: (response)=>{
            if(response.status){
                location.reload()
            }
        }
    }) 
}

let count = 0; 
$('#couponForm').submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/applyCoupon',
        method: 'post',
        data: $('#couponForm').serialize(),
        success: (result) => {
            if (result.message) {
                console.log('message was here');
                $('#invalidCoupon').addClass('d-none');
                $('#couponApplied').addClass('d-none');
            } else {
                if (!result.invalid) {
                        if (count == 0) {
                            count = 1;
                            let shipping_Cost = 0;
                            let currentSubTotal = parseInt($('#totalCartPrice').html().replace(/^\D+/g, ''));
                            console.log(currentSubTotal);
                            if (currentSubTotal < 500) {
                                $('#shippingCharge').html('₹ 50');
                                shipping_Cost = 50;
                            } else {
                                $('#shippingCharge').html('₹ 0');
                                shipping_Cost = 0;
                            }
    
                            $('#invalidCoupon').addClass('d-none');
                            $('#couponApplied').removeClass('d-none');
                            let discount = result.percentage;
                            let subTotal = $('#totalCartPrice').html().replace(/^\D+/g, '');
                            console.log('subTotal = ',subTotal);
                            console.log('discount = ',discount);
                            console.log('result',result);
                            let discountPrice = Math.round(subTotal * discount / 100);
                            console.log('discountPrice = ',discountPrice);
                            subTotal = subTotal - discountPrice;
                            $('#discount').removeClass('d-none');
                            $('#discountPrice').removeClass('d-none');
                            $('#discountPrice').html('₹ ' + discountPrice);
                            $('#couponDiscount').html('₹ ' + (discountPrice));
                            $('#fullTotal').html('₹ ' + (subTotal + shipping_Cost));
                        }
                } else {
                    $('#invalidCoupon').removeClass('d-none');
                    $('#couponApplied').addClass('d-none');
                }
            }
        }
    })
})
function proceedtoCheckout() {
    console.log('proceed to checkout');
    let couponCode = document.getElementById('couponCode').value;
    console.log(couponCode,'coupnCode');

    $.ajax({
        url: '/proceedtoCheckout',
        method: 'post',
        data: {
            couponCode: couponCode
        },
        success: (response) => {
            location.href = '/checkout'
        }
    })
}