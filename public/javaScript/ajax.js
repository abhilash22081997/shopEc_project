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