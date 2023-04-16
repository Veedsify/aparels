$("#registerForm").submit(function (e) {
    e.preventDefault();
    let firstname = document.querySelector("#fname").value;
    let lastname = document.querySelector("#lname").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    axios
        .post("/register/new-user", {
            firstname,
            lastname,
            email,
            password,
        })
        .then((res) => {
            checkResponse(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
});

$("#loginForm").submit(function (e) {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    axios
        .post("/login/new", {
            email,
            password,
        })
        .then(({ data }) => {
            checkResponse(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

// FUNCTIONS

function editcard(cardId) {
    axios
        .post("/user/cards", {
            card_id: cardId,
        })
        .then((res) => {
            if (res) {
                swal({
                    title: "Update Card",
                    content: editCardHTML(res.data[0].CARD_ID),
                    buttons: {
                        Cancel: {
                            default: true,
                            text: "Cancel",
                            className: "btn btn-secondary btn-sm",
                        },
                    },
                });
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

function checkResponse({ link, message }) {
    if (link) {
        window.location.href = link;
    } else {
        swal({
            text: message,
        });
    }
}

// WISHLIST FUNCTION
function wishlist(product_id) {
    axios
        .post("/wishlist/create-new-wishlist", {
            ID: product_id,
        })
        .then(({ data }) => {
            if (data.type == "link") {
                window.location.href = data.link;
            } else {
                swal({
                    icon: "success",
                    text: data.message,
                    button: {
                        className: "btn-solid",
                    },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function addToCartPage(ID) {
    const color = document.querySelector(".color-variant .active");
    const size = document.querySelector(".size-selected .active");
    const quantity = $("#quantity").val();

    if (!color) {
        swal({
            icon: "info",
            text: "Please select a color",
            buttons: {
                confirm: {
                    className: "btn-solid",
                },
            },
        });
        return;
    }

    if (!size) {
        swal({
            icon: "info",
            text: "Please select a size",
            buttons: {
                confirm: {
                    className: "btn-solid",
                },
            },
        });
        return;
    }

    if (!parseInt(quantity) > 0) {
        swal({
            icon: "info",
            text: "Please select your order quantity",
            buttons: {
                confirm: {
                    className: "btn-solid",
                },
            },
        });
        return;
    }

    const selectSize = $("#selectSize .size-box ul");
    const addedNotification = $(".added-notification");

    if (selectSize.hasClass("selected")) {
        const image = $("#cartEffect").data("productimg");
        addedNotification.find("img").attr("src", image);
        addedNotification.addClass("show");

        axios
            .post("/order/add-to-cart", {
                ID,
                size: size.classList[0],
                quantity,
                color: color.classList[0],
            })
            .then((res) => {
                console.log(res.data)
                if (res.data.link) {
                    swal({
                        text: `You need to login first`,
                        icon: 'info',
                        button: {
                            className: 'btn-solid',
                        }
                    }).then((res) => {
                        return window.location.href = res.data.link
                    })
                }

                addedNotification.find("img").attr("src", image);
                addedNotification.addClass("show");
                setTimeout(() => addedNotification.removeClass("show"), 5000);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        $("#selectSize").addClass("cartMove");
    }
}

setInterval(() => {
    const shoppingCart = document.getElementById("shopping-cart");
    axios
        .post("/order/get-cart", {})
        .then((res) => {
            const data = res.data.items;
            const total = res.data.totals;
            const price = Number(res.data.price).toLocaleString();
            const holder = document.createElement("li");

            let prevData = null;

            if (data) {
                $("#cart-qtt").html(total);
                $("#cart-total").html(`${data[0]?.PRODUCT_CURRENCY || "₦"}${price}`);
                function renderShoppingCart(data) {
                    const newData = data;
                    if (prevData !== newData) {
                        const holder = document.createElement("div");
                        holder.classList.add("shopping-cart-items");
                        data.forEach((item) => {
                            holder.innerHTML += `<li><div class="media">
                <a href="/order/cart/">
                  <img alt="${item.PRODUCT_NAME}" class="me-3" src="${item.PRODUCT_IMAGE
                                }" />
                </a>
                <div class="media-body">
                  <a href="/order/cart"><h5 class="text-text-truncate">${item.PRODUCT_NAME
                                }</h5></a>
                  <h4><span>${item.QUANTITY} x ${item.PRODUCT_CURRENCY
                                }${parseInt(item.PRODUCT_PRICE).toLocaleString()}</span></h4>
                </div>
              </div>
              <div class="close-circle">
                <a href="javascript:removeCartItem('${item.PRODUCT_ID
                                }')"><i class="fa fa-times" aria-hidden="true"></i></a>
              </div></li>`;
                        });
                        shoppingCart.innerHTML = "";
                        shoppingCart.appendChild(holder);
                        prevData = newData;
                    }
                }
                renderShoppingCart(data);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}, 1000);

const removeCartBtn = document.querySelectorAll(".removeCartBtn");

removeCartBtn.forEach((button) => {
    button.addEventListener("click", async (e) => {
        const { target } = e;

        const product_id = target.getAttribute("data-pr");

        if (removeCartItem(product_id)) {
            setTimeout(() => {
                axios
                    .post("/order/cart", {})
                    .then((res) => {
                        target.closest("tr").remove();
                        $("#final_price").html(Number(res.data.totals).toLocaleString());
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 100);
        }
    });
});

function removeCartItem(ID) {
    return axios
        .delete("/order/remove-cart-item", {
            data: {
                ID,
            },
        })
        .then((res) => {
            if (res.data) {
                return;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

$("#placeOrder").click(function (e) {
    e.preventDefault();
    const firstname = $("#firstName").val();
    const lastname = $("#lastname").val();
    const phone = $("#phone").val();
    const email = $("#email").val();
    const country = $("#country").val();
    const address = $("#address").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const postalcode = $("#postalcode").val();
    const homeDelivery = $("#home_delivery");
    const localPickup = $("#local-pickup");
    const cashOnDelivery = $("#payment-2");
    const cardPayment = $("#payment-1");

    if (!validateOrderForm(firstname, 3, 20)) {
        return swal({
            icon: "warning",
            text: "Sorry, you'd need a first name to proceed",
        });
    }
    if (!validateOrderForm(lastname, 3, 20)) {
        return swal({
            icon: "warning",
            text: "Sorry, you'd need a last name to proceed",
        });
    }
    if (!validateOrderForm(phone, 3, 14)) {
        return swal({
            icon: "warning",
            text: "Sorry, you'd need a phone number to proceed",
        });
    }
    if (!validateOrderForm(email, 3, 50)) {
        return swal({
            icon: "warning",
            text: "Sorry, you'd need an email address to proceed",
        });
    }
    if (!validateOrderForm(country, 3, 50)) {
        return swal({
            icon: "warning",
            text: "Sorry, select a country to proceed",
        });
    }
    if (!validateOrderForm(address, 3, 50)) {
        return swal({
            icon: "warning",
            text: "Sorry, add a shipping address to proceed",
        });
    }
    if (!validateOrderForm(city, 2, 50)) {
        return swal({
            icon: "warning",
            text: "Sorry, add a city to proceed",
        });
    }
    if (!validateOrderForm(state, 2, 50)) {
        return swal({
            icon: "warning",
            text: "Sorry, add a state to proceed",
        });
    }
    if (!validateOrderForm(postalcode, 2, 50)) {
        return swal({
            icon: "warning",
            text: "Sorry, add a postal code to proceed",
        });
    }
    if (
        homeDelivery.prop("checked") === false &&
        localPickup.prop("checked") === false
    ) {
        return swal({
            icon: "warning",
            text: "Sorry, select a shipping option to proceed",
        });
    }

    if (
        cardPayment.prop("checked") === false &&
        cashOnDelivery.prop("checked") === false
    ) {
        return swal({
            icon: "warning",
            text: "Sorry, select a shipping option to proceed",
        });
    }

    swal({
        icon: "info",
        text: "You will be redirected to flutterwave to complete your purchase, do you wish to proceed?",
        buttons: {
            cancel: true,
            confirm: {
                text: "Yes, proceed",
                className: "btn-success",
            },
        },
    }).then((res) => {
        if (res == true) {
            swal({
                icon: '/IMAGES/load.gif',
                text: 'Redirecting..',
                button: false
            })
            axios
                .put("/order/create-new-order", {
                    firstname,
                    lastname,
                    phone,
                    email,
                    country,
                    address,
                    city,
                    state,
                    postalcode,
                    card: {
                        card: cardPayment.prop("checked"),
                        cash: cashOnDelivery.prop("checked"),
                    },
                    delivery: {
                        home: homeDelivery.prop("checked"),
                        local: localPickup.prop("checked"),
                    },
                })
                .then((res) => {



                    console.log(res.data.url);
                    window.location.href = res.data.url
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
});

function validateOrderForm(selector, minLength, maxLength) {
    const inputValue = selector.trim();

    if (inputValue.length < minLength || inputValue.length > maxLength) {
        return false;
    }

    return true;
}


let previewFile = document.querySelectorAll("#preview-file");

previewFile.forEach((input) => {
    input.addEventListener("change", (e) => {
        let parent = input.closest("label");
        let image = parent.querySelector("img");
        let formerImage = image.src
        let uploaded = parent.querySelector(".upload");
        let url = URL.createObjectURL(input.files[0]);

        if (input.files[0].type !== "image/jpeg" && input.files[0].type !== "image/jpg") {
            swal({
                icon: "warning",
                text: "Image Format Not Supported, Accepted(JPEG, JPG)",
                button: {
                    className: "btn-success",
                },
            })
            return image.src = formerImage;
        }
        const maxSizeInBytes = 2 * 1024 * 1024;

        if (input.files[0].size > maxSizeInBytes) {
            swal({
                icon: "warning",
                text: "Image is large, Accepted (2mb max)",
                button: {
                    className: "btn-success",
                },
            })
            return image.src = formerImage;
        }

        image.src = url;

        const formData = new FormData();

        // Append the image file to the form data
        formData.append("image", input.files[0]);

        // Make a POST request using Axios
        axios
            .post(`/user/profile/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    // progressBar.style.width = `${percent}%`;
                    const htmlUpload = document.createElement("div");
                    htmlUpload.innerHTML = `<div style="min-height:20vh;"> <div class="progress rounded-0 h-25px">
                    <div class="progress-bar progress-bar-succes progress-bar-striped activeProgress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0"
                      aria-valuemax="100" style="width:${percent}%">
                      ${percent}%
                    </div>
                  </div></div>`;

                    swal({
                        title: "Uploading Your Image",
                        content: htmlUpload,
                        button: false,
                    });
                },
            })
            .then((response) => {
                if (response) {
                    swal({
                        icon: "success",
                        text: "Image Upload Successful",
                        button: {
                            className: "btn-success",
                        },
                    }).then(res => {
                        window.location.reload();
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    })
})


const shopCategory = document.querySelectorAll('.shop-category')
const sizes = document.querySelectorAll('.sizes')
const productColors = document.querySelectorAll('.productColors')
// Get the URL of the current page
var currentUrl = window.location.href;

function setUrlQueries(queries) {
    var queryParams = new URLSearchParams(window.location.search);
    for (var key in queries) {
        if (queries.hasOwnProperty(key)) {
            queryParams.set(key, queries[key]);
        }
    }
    window.history.replaceState(null, '', '?' + queryParams.toString());
}


const listProduct = document.querySelector('.list-product')

for (category of shopCategory) {
    category.addEventListener('click', (event) => {
        const id = event.target.value
        setUrlQueries({
            "category": id
        });
    })
}

for (size of sizes) {
    size.addEventListener('click', (event) => {
        const id = event.target.value
        setUrlQueries({
            "size": id
        });
    })
}
for (color of productColors) {
    color.addEventListener('click', (event) => {
        const id = event.target.getAttribute('data-color');
        setUrlQueries({
            "color": id
        });
    })
}

listProduct?.addEventListener('change', (event) => {
    const id = event.target.value
    setUrlQueries({
        "count": id
    });
})

document.querySelector('#year').innerHTML = new Date().getFullYear()