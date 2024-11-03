// Preloader
window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.preloader').style.display = 'none';
});

console.log(window.location.pathname);

// Get Views Count
let viewsCount = 0;

fetch('https://script.google.com/macros/s/AKfycbwDJB5j0Br0BDSKR_RjJIjfoGAfslcpJkQXbBF87V_EVF7TCyPeGVY7AKidlHXIfOwlYA/exec?action=getviews')
    .then(response => response.json())
    .then(data => {
        /*
        document.querySelector('.views').textContent = data.data;
        viewsCount = parseInt(data.data);
        */
        viewsCount = parseInt(data.data);
        let counter;
        let i = 0;
        counter = setInterval(() => {
            if (i < viewsCount) {
                i+=1;
                document.querySelector('.views').textContent = i;
            } else {
                clearInterval(counter);
            }
        }, 50);
    })
    .catch((error) => {
        // console.error(error);
    });

// Check Visitors
if (!localStorage.getItem('isNewVisitors')) {
    // Add Visitors
    fetch('https://script.google.com/macros/s/AKfycbwDJB5j0Br0BDSKR_RjJIjfoGAfslcpJkQXbBF87V_EVF7TCyPeGVY7AKidlHXIfOwlYA/exec?action=updateviews', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            viewsCount += 1;
            document.querySelector('.views').textContent = viewsCount;
        })
        .catch(error => {
            // console.error(error);
        });

    // Save Visitors to Local Storage
    localStorage.setItem('isNewVisitors', 1);
}

// Get Copyright
var date = new Date();
document.querySelector('.copyright').innerHTML = "Copyright ©" + date.getFullYear() + " KIKO Studio. All Rights Reserved.";
