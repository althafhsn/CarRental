
// SIDBAR

window.onload = function () {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");

    // If the admin is not authenticated, redirect to login page
    if (isAuthenticated !== "true") {
        window.location.href = "./adminLogin.html";
    }

};

document.getElementById("logoutButton").addEventListener('click', () => {

    sessionStorage.removeItem("isAuthenticated");
    window.location.href = "./adminLogin.html";
})

// Optional: Log out function to clear authentication
function logout() {
    sessionStorage.removeItem("isAuthenticated");
    window.location.href = "login.html";
}

const allDropdown = document.querySelectorAll('#side-bar .side-dropdown');
const sideBar = document.getElementById('side-bar');

allDropdown.forEach(item => {
    const a = item.parentElement.querySelector('a:first-child');
    // console.log(a);
    a.addEventListener('click', function (e) {
        e.preventDefault();

        if (!this.classList.contains('active')) {
            allDropdown.forEach(elements => {
                const aLink = elements.parentElement.querySelector('a:first-child');
                aLink.classList.remove('active')
                elements.classList.remove('show')

            })
        }

        this.classList.toggle('active')
        item.classList.toggle('show')
    })
});

//SIDEBAR COLLAPS   
const toggleSidebar = document.querySelector('nav .toggle-side-bar');
const allSideDivider = document.querySelectorAll('#side-bar .divider');

if (sideBar.classList.contains('hide')) {
    allSideDivider.forEach(i => {
        i.textContent = '-'
    });
    allDropdown.forEach(item => {
        const a = item.parentElement.querySelector('a:first-child');
        a.classList.remove('active');
        item.classListr.remove('show')
    });
} else {
    allSideDivider.forEach(i => {
        i.textContent = i.dataset.text;
    })
}

toggleSidebar.addEventListener('click', function () {
    sideBar.classList.toggle('hide');

    if (sideBar.classList.contains('hide')) {
        allSideDivider.forEach(i => {
            i.textContent = '-'
        });
        allDropdown.forEach(item => {
            const a = item.parentElement.querySelector('a:first-child');
            a.classList.remove('active');
            item.classListr.remove('show')
        });
    } else {
        allSideDivider.forEach(i => {
            i.textContent = i.dataset.text;
        })
    }
});
//SIDEBAR COLLAPS

sideBar.addEventListener('mouseleave', function () {
    if (this.classList.contains('hide')) {
        allDropdown.forEach(item => {
            const a = item.parentElement.querySelector('a:first-child');

            a.classList.remove('active')
            item.classList.remove('show')
        })
        allSideDivider.forEach(i => {
            i.textContent = '-'
        })
    }
});

sideBar.addEventListener('mouseenter', function () {
    if (this.classList.contains('hide')) {
        allDropdown.forEach(item => {
            const a = item.parentElement.querySelector('a:first-child');

            a.classList.remove('active')
            item.classList.remove('show')
        })
        allSideDivider.forEach(i => {
            i.textContent = i.dataset.text;
        })
    }
});



//PROFILE DROPDOWN

const profile = document.querySelector('nav .profile');
const imgProfile = document.querySelector('img');
const dropdownProfile = document.querySelector('.profile-link');


imgProfile.addEventListener('click', function () {
    dropdownProfile.classList.toggle('show');
});

//MENU
const allMenu = document.querySelectorAll('.dashboard-main .content-data .head .menu');
allMenu.forEach(item => {
    const icon = item.querySelector('.icon');
    const menuLink = item.querySelector('.menu-link');

    icon.addEventListener('click', function () {
        menuLink.classList.toggle('show')
    })
});

//MENU

window.addEventListener('click', function (e) {
    if (e.target !== imgProfile) {
        if (e.target !== dropdownProfile) {
            if (dropdownProfile.classList.contains('show')) {
                dropdownProfile.classList.remove('show')
            }
        }
    }
    allMenu.forEach(item => {
        const icon = item.querySelector('.icon');
        const menuLink = item.querySelector('.menu-link');

        if (e.target !== icon) {
            if (e.target !== menuLink) {
                if (menuLink.classList.contains('show')) {
                    menuLink.classList.remove('show')
                }
            }
        }
    })

})
//PROFILE DROPDOWN


//NAVIGATE PAGES
function showSection(sectionId, element) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    const sectionToShow = document.getElementById(sectionId);
    sectionToShow.classList.add('active');

    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.side-manu a');
    menuItems.forEach(item => item.classList.remove('active'));

    // Add active class to the clicked item
    element.classList.add('active');
}
//NAVIGATE PAGES


// Image preview
document.addEventListener('DOMContentLoaded', function () {
    const logoInput = document.getElementById('logo-id');
    const fakeUploadLogo = document.getElementById('fakeUploadLogo');
    const imgPreview = document.querySelector('.img-preview');

    logoInput.addEventListener('change', function () {
        const filename = this.value.split('\\').pop();
        fakeUploadLogo.value = filename;

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// Function to fetch available cars
async function fetchAvailableCars() {
    try {
        // Fetch all cars from the API
        const carsResponse = await fetch('http://localhost:5034/api/Car/getAllCars'); // Replace with your actual API endpoint
        const cars = await carsResponse.json();
        // Fetch all rental requests from the API
        const rentalRequestsResponse = await fetch('http://localhost:5034/api/RentalRequest/getAllRentalRequests'); // Replace with your actual API endpoint
        const rentalRequests = await rentalRequestsResponse.json();
        // Get all rented car IDs
        const rentedCarIds = rentalRequests.map(request => request.carId); // Assuming carId is the property name in rental requests
        // Filter out available cars
        const availableCars = cars.filter(car => !rentedCarIds.includes(car.carId)); // Assuming id is the property name in car objects
        // Display the available cars in a table
        displayAvailableCars(availableCars);
console.log(availableCars);

        const availableCarsCardText = document.getElementById('availableCarsCount');



        // Update the card text with the total number of available cars
        availableCarsCardText.innerText = availableCars.length;

    } catch (error) {
        console.error('Error fetching available cars:', error);
    }


    // Function to display available cars in a table
    function displayAvailableCars(cars) {
        const availableCarsElement = document.getElementById('availableCars');

        // Clear existing content
        availableCarsElement.innerHTML = '';

        // Check if there are available cars
        if (cars.length === 0) {
            availableCarsElement.innerHTML = '<tr><td colspan="5">No available cars.</td></tr>';
            return;
        }

        // Display each available car in a table row
        cars.forEach((car, index) => {
            const carElement = document.createElement('tr');
            carElement.innerHTML = `
            <td>${index + 1}</td>
            <td>${car.id || car.carId}</td> <!-- Adjust based on your API response -->
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.dailyPrice || car.price}</td> <!-- Adjust based on your API response -->
        `;
            availableCarsElement.appendChild(carElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rentalTableBody = document.getElementById('rentalRequestsTableBody');

    // API endpoint for fetching rental requests
    const apiUrl = ('http://localhost:5034/api/RentalRequest/getAllRentalRequests');

    // Function to fetch data from API
    async function fetchRentalRequests() {
        try {
            const response = await fetch(apiUrl); // Fetch the data
            const rentalRequests = await response.json(); // Convert response to JSON

            // Filter approved rental requests
            const approvedRequests = rentalRequests.filter(request => request.status === 'Approved');

            // Populate the table with approved rental requests
            approvedRequests.forEach((request, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td> 
                    <td>${request.rentalId}</td>
                    <td>${request.carId}</td>
                    <td>${request.customerId}</td>
                    <td>${request.startDate}</td>
                    <td>${request.endDate}</td>
                `;
                rentalTableBody.appendChild(row);
            });

            const rentedCarCount = document.getElementById('rentedCars');
            rentedCarCount.innerHTML = approvedRequests.length;
        } catch (error) {
            console.error('Error fetching rental requests:', error);
        }
    }

    // Call the function to fetch data when the page is loaded
    fetchRentalRequests();
});


document.addEventListener('DOMContentLoaded', () => {
    // API endpoint for fetching rental requests
    const apiUrl = ('http://localhost:5034/api/RentalRequest/getAllRentalRequests');
    const carApiUrl = ('http://localhost:5034/api/Car/getAllCars');

    // Function to fetch data from API and calculate total revenue
    async function fetchRentalRequestsAndCalculateRevenue() {
        try {
            const response = await fetch(apiUrl); // Fetch the data
            const rentalRequests = await response.json(); // Convert response to JSON

            // Fetch cars
            const carsResponse = await fetch(carApiUrl);
            const cars = await carsResponse.json();

            // Filter approved rental requests
            const approvedRequests = rentalRequests.filter(request => request.status === 'Approved');

            // Calculate total revenue
            const totalRevenue = approvedRequests.reduce((acc, request) => acc + request.totalPrice, 0);

            // Display total revenue
            document.getElementById('totalRevenue').innerText = totalRevenue.toFixed(2); // Assuming you want to display it with 2 decimal places



            // Create a map to correlate car IDs with their brands
            const carBrandMap = {};
            cars.forEach(car => {
                carBrandMap[car.carId] = car.brand; // Assuming each car has an 'id' and 'brand' property
            });

            // Group total revenue by car brand
            const revenueByBrand = {};

            rentalRequests.forEach(request => {
                if (request.status === 'Approved') {
                    const carId = request.carId; // Assuming this field exists in the rental request
                    const totalPrice = request.totalPrice; // Assuming this field exists in the rental request
                    const brand = carBrandMap[carId]; // Get brand from the map

                    // If the brand is not in the revenueByBrand object, initialize it
                    if (!revenueByBrand[brand]) {
                        revenueByBrand[brand] = 0;
                    }

                    // Add the total price to the corresponding brand
                    revenueByBrand[brand] += totalPrice;
                }
            });

            // Clear existing rows in the table
            const revenueBody = document.getElementById('revenueBody');
            revenueBody.innerHTML = '';

            // Populate the table with revenue data
            for (const brand in revenueByBrand) {
                const row = document.createElement('tr');
                row.innerHTML = `
                     <td>${brand}</td>
                     <td>${revenueByBrand[brand].toFixed(2)}</td> <!-- Display with 2 decimal places -->
                 `;
                revenueBody.appendChild(row);
            }

        } catch (error) {
            console.error('Error fetching rental requests:', error);
        }
    }

    // Call the function to fetch data and calculate revenue when the page is loaded
    fetchRentalRequestsAndCalculateRevenue();
});

function calculateOverdue(endDate, returnDate) {
    const end = new Date(endDate);
    const returnD = new Date(returnDate);
    
    // Calculate the difference in time (in milliseconds)
    const timeDifference = returnD - end;
    
    // Convert milliseconds to days
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    // If return date is after the end date
    if (dayDifference > 0) {
        return dayDifference; // Number of overdue days
    } else {
        return 0; // No overdue
    }
}

async function handleReturnButtonClick(rentalId) {
    const rentalRequests = await getAllRentalRequests();

    // Find the rental request by ID
    const rental = rentalRequests.find(r => r.id === rentalId);

    if (rental) {
        const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const overdueDays = calculateOverdue(rental.endDate, currentDate);
        
        if (overdueDays > 0) {
            console.log(`Car is overdue by ${overdueDays} days.`);
            // You can update the UI to show this information
            alert(`Car is overdue by ${overdueDays} days.`);
        } else {
            console.log('Car is returned on time.');
            alert('Car is returned on time.');
        }

        // Update the rental status in the backend (optional)
        await updateRentalStatus(rentalId, 'returned');
    } else {
        console.error('Rental request not found');
    }
}
calculateOverdue();
fetchAvailableCars();
// Call the function to fetch available cars





