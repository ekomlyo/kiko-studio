// Preloader
window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.preloader').style.display = 'none';
});

let dataIsAvailable;

// Get Database
function getPresetData(action, selectedPreset) {
    dataIsAvailable = false;

    // Reset Popup Content
    if (selectedPreset != '') {
        // Reset Selected Preset
        const card = document.querySelector('.popup-checkout .card-popup .content .card');
        card.innerHTML = '';
        card.innerHTML = `
            <span class="loading">Please wait...</span>
        `;
        // Reset WA Number
        const waNumber = document.querySelector('.wa-number');
        waNumber.value = '';
        // Reset Total Price
        const totalPrice = document.querySelector('.popup-checkout .card-popup .footer .total-price .price');
        totalPrice.textContent = 'Rp 0';

        // Show Popup
        const popupCheckout = document.querySelector('.popup-checkout');
        popupCheckout.classList.add('active');
        const cardPopup = document.querySelector('.popup-checkout .card-popup');
        cardPopup.classList.add('active');
        const closePopup = document.querySelector('span.close-popup');
        closePopup.classList.add('active');
    }

    // Get API
    fetch('https://script.google.com/macros/s/AKfycbwDJB5j0Br0BDSKR_RjJIjfoGAfslcpJkQXbBF87V_EVF7TCyPeGVY7AKidlHXIfOwlYA/exec?action=getpresets')
        .then(response => response.json())
        .then(data => {
            dataIsAvailable = true;

            if (action == 0) {
                // Hide Loading
                const cardWrapper = document.querySelector('.presets .card-wrapper');
                cardWrapper.innerHTML = '';

                // Show Presets
                for (let i = 0; i < data.data.length; i++) {
                    cardWrapper.innerHTML = cardWrapper.innerHTML + `
                        <div class="card" onclick="getPresetData(1, '${data.data[i].number}');" style="animation-delay: ${i * 0.2}s;">
                            <div class="thumb">
                                <img src="${data.data[i].thumbnail}" alt="${data.data[i].number}" loading="lazy">
                                <div class="status">
                                    <span><img src="shopping_cart.svg" alt="Shopping Cart"></span>
                                    <p>${data.data[i].status}</p>
                                </div>
                            </div>
                            <div class="details">
                                <h5>${data.data[i].number}</h5>
                                <h4>${data.data[i].title}</h4>
                                <ul>
                                    <li>Video Duration : ${data.data[i].duration}</li>
                                    <li>Price : ${data.data[i].price}</li>
                                </ul>
                            </div>
                        </div>
                    `;
                }
            } else {
                // Get Selected Preset
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].number == selectedPreset) {
                        const card = document.querySelector('.popup-checkout .card-popup .content .card');
                        card.innerHTML = `
                            <div class="thumb">
                                <img src="${data.data[i].thumbnail}" alt="${data.data[i].number}">
                                <a href="${data.data[i].preview}" target="_blank" class="btn-preview">
                                    <span><img src="play.svg" alt="Player Play"></span>
                                    <p>Preview</p>
                                </a>
                            </div>
                            <div class="details">
                                <h5 class="preset-number">${data.data[i].number}</h5>
                                <h4 class="preset-title">${data.data[i].title}</h4>
                                <ul>
                                    <li>Video Duration : ${data.data[i].duration}</li>
                                    <li>Price : ${data.data[i].price}</li>
                                </ul>
                            </div>
                        `;

                        // Set Total Price
                        const totalPrice = document.querySelector('.popup-checkout .card-popup .footer .total-price .price');
                        totalPrice.textContent = data.data[i].price;
                    }
                }
            }
        })
        .catch((error) => {
            if (action == 0) {
                const loading = document.querySelector('.popup-checkout .card-popup .content .card .loading');
                loading.innerHTML = 'Upss Sorry...<br />Something went wrong!';
            } else {
                const loading = document.querySelector('.presets .card-wrapper .loading');
                loading.innerHTML = 'Upss Sorry...<br />Something went wrong!';
            }
            // console.error(error);
        });
}

// Close Popup
const closePopup = document.querySelector('span.close-popup');

closePopup.addEventListener('click', function(e) {
    const popupCheckout = document.querySelector('.popup-checkout');
    popupCheckout.classList.add('hidden1');
    const cardPopup = document.querySelector('.popup-checkout .card-popup');
    cardPopup.classList.add('hidden');
    closePopup.classList.add('hidden');
    setTimeout(() => {
        popupCheckout.classList.remove('active');
        popupCheckout.classList.remove('hidden1');
        cardPopup.classList.remove('active');
        cardPopup.classList.remove('hidden');
        closePopup.classList.remove('active');
        closePopup.classList.remove('hidden');
    }, 1400);
});

// Button Order
const btnOrder = document.querySelector('.popup-checkout .card-popup .footer .btn-order');

btnOrder.addEventListener('click', function(e) {
    if (dataIsAvailable) {
        const presetNumber = document.querySelector('.preset-number').textContent;
        const presetTitle = document.querySelector('.preset-title').textContent;
        const waNumber = document.querySelector('.wa-number').value;
        if (waNumber.length > 0) {
            // Hide Card Popup
            const cardPopup = document.querySelector('.popup-checkout .card-popup');
            cardPopup.classList.add('hidden');
            closePopup.classList.add('hidden');

            // Show Loading
            const loadingPopup = document.querySelector('.popup-checkout .loading');
            loadingPopup.classList.add('active');

            // Hit EmailJS API
            const templateParams = {
                wa_number: waNumber,
                selected_preset: `${presetNumber} - ${presetTitle}`
            };
            const serviceId = 'service_gut3x6m';
            const templateId = 'template_xk83ymr';

            emailjs.send(serviceId, templateId, templateParams)
                .then(response => {
                    popupMessage(1, "Your order has been sent successfully!");
                    const popupCheckout = document.querySelector('.popup-checkout');
                    popupCheckout.classList.add('hidden2');
                    loadingPopup.classList.add('hidden');
                    setTimeout(() => {
                        popupCheckout.classList.remove('active');
                        popupCheckout.classList.remove('hidden2');
                        cardPopup.classList.remove('active');
                        cardPopup.classList.remove('hidden');
                        closePopup.classList.remove('active');
                        closePopup.classList.remove('hidden');
                        loadingPopup.classList.remove('active');
                        loadingPopup.classList.remove('hidden');
                    }, 500);
                })
                .catch((error) => {
                    popupMessage(0, "Upss Sorry...\nSomething went wrong!");
                    console.error(error);
                });
        } else {
            popupMessage(0, "Please, enter your WhatsApp Number first!");
        }
    } else {
        popupMessage(0, "Please wait a moment. . .");
    }
});

// Load Presets
getPresetData(0, '');

// Alert
const alert = document.querySelector('.alert');
const alertIcon = document.querySelector('.alert .alert-icon img');
const alertMessage = document.querySelector('.alert .alert-message');
const closeAlert = document.querySelector('.alert .close-alert');
let hiddenPopup;

function popupMessage(status, message) {
    // Set Accent Color
    if (status == 0) {
        alertIcon.src = 'alert.svg';
        if (alert.classList.contains('success')) {
            alert.classList.remove('success');
        }
    } else {
        if (status == 1) {
            alertIcon.src = 'check.svg';
            alert.classList.add('success');
        }
    }

    // Set Visibility
    if (alert.classList.contains('active')) {
        alert.classList.remove('active');
        clearTimeout(hiddenPopup);
        setTimeout(() => {
            alertMessage.textContent = message;
            alert.classList.add('active');
            hiddenPopup = setTimeout(() => {
                alert.classList.remove('active');
            }, 4000);
        }, 200);
    } else {
        alertMessage.textContent = message;
        alert.classList.add('active');
        hiddenPopup = setTimeout(() => {
            alert.classList.remove('active');
        }, 4000);
    }
}

closeAlert.addEventListener('click', function(e) {
    alert.classList.remove('active');
    clearTimeout(hiddenPopup);
});

// Get Copyright
var date = new Date();
document.querySelector('.copyright').innerHTML = "Copyright ©" + date.getFullYear() + " KIKO Studio. All Rights Reserved.";