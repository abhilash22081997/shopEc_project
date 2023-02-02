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