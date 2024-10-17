// Profile dropdown functionality
const profile = document.querySelector('.profile');
const imgProfile = document.querySelector('img');
const dropdownProfile = document.querySelector('.profile-link');

imgProfile.addEventListener('click', () => {
    dropdownProfile.classList.toggle('show');
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const signinProfile = document.getElementById('signinProfile');
    const userProfile = document.getElementById('userProfile');
    const logoutButton = document.getElementById('logoutButton');
    
    const isAuthenticated = sessionStorage.getItem('isAuthenticatedUser') === 'true';
    const profileImage = sessionStorage.getItem('profileImage');

    if (isAuthenticated) {
        userProfile.style.display = 'block';
        signinProfile.style.display = 'none';

        if (profileImage) {
            userProfile.querySelector('img').src = profileImage;
        }
    } else {
        userProfile.style.display = 'none';
        signinProfile.style.display = 'block';
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'signin.html';
        });
    }

    // Start checking for overdue rentals
    setInterval(checkForCustomerOverdueRentals, 24 * 60 * 60 * 1000); // Check every 24 hours
});

// Open the Edit User modal
function openEditUserModal() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in session storage.');
        return;
    }

    fetch(`http://localhost:5034/api/Customer/GetCustomerById?customerId=${userId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error fetching user data: ${response.statusText}`);
            return response.json();
        })
        .then(user => populateEditUserModal(user))
        .catch(error => alert('Failed to fetch user data. Please try again later.'));
}

// Populate Edit User modal with user data
function populateEditUserModal(user) {
    document.getElementById('editUserId').value = user.customerId;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editMobileNo').value = user.phone;
    document.getElementById('editAddress').value = user.address;
    document.getElementById('editNIC').value = user.nic;
    document.getElementById('editLicense').value = user.licence;

    const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editModal.show();
}

// Save edited user details
document.getElementById('saveUserChangesBtn').addEventListener('click', async function () {
    const userId = document.getElementById('editUserId').value;
    const updatedUserData = getUpdatedUserData();

    if (!areFieldsValid(updatedUserData)) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5034/api/Customer/UpdateCustomerById?customerId=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });

        if (!response.ok) throw new Error('Failed to save changes');

        const responseData = await response.json();
        console.log('User updated successfully:', responseData);
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
        alert('User details updated successfully!');
        window.location.reload(); // Refresh to see changes
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again later.');
    }
});

// Retrieve updated user data from modal fields
function getUpdatedUserData() {
    return {
        firstName: document.getElementById('editFirstName').value.trim(),
        lastName: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editMobileNo').value.trim(),
        address: document.getElementById('editAddress').value.trim(),
        licence: document.getElementById('editLicense').value.trim(),
        nic: document.getElementById('editNIC').value.trim()
    };
}

// Validate input fields
function areFieldsValid(userData) {
    return Object.values(userData).every(value => value !== '');
}

// Check for overdue rentals
async function checkForCustomerOverdueRentals() {
    const loggedInCustomerId = sessionStorage.getItem('userId');
    try {
        const response = await fetch('http://localhost:5034/api/RentalRequest/getAllRentalRequests');
        const rentals = await response.json();
        const today = new Date();

        rentals.forEach(rental => {
            const rentalEndDate = new Date(rental.endDate);
            const duration = Math.floor((rentalEndDate - today) / (1000 * 60 * 60 * 24));

            if (rental.customerId == loggedInCustomerId && rental.status === 'active' && duration <= 1) {
                alert(`Reminder: Your rental is due in ${duration} days! Rental ID: ${rental.rentalId}`);
            }
        });
    } catch (error) {
        console.error('Error fetching rental data:', error);
    }
}

// Fetch and display rental history
async function fetchRentalHistory() {
    const loggedInUserId = sessionStorage.getItem('userId');
    try {
        const rentalRequests = await fetch('http://localhost:5034/api/RentalRequest/getAllRentalRequests').then(res => res.json());
        const cars = await fetch('http://localhost:5034/api/Car/getAllCars').then(res => res.json());

        const carMap = createCarMap(cars);
        displayRentalHistory(rentalRequests, carMap, loggedInUserId);
    } catch (error) {
        console.error('Error fetching rental history:', error);
        alert('Failed to load rental history. Please try again later.');
    }
}

// Create a map to correlate car IDs with their details
function createCarMap(cars) {
    return cars.reduce((map, car) => {
        map[car.carId] = {
            regNo: car.regNo,
            brand: car.brand,
            model: car.model,
            dailyPrice: car.dailyPrice
        };
        return map;
    }, {});
}

// Display rental history in the modal
function displayRentalHistory(rentalRequests, carMap, loggedInUserId) {
    const rentalHistoryBody = document.getElementById('rentalHistoryBody');
    rentalHistoryBody.innerHTML = '';

    rentalRequests.forEach((request, index) => {
        if (request.customerId == loggedInUserId) {
            const car = carMap[request.carId];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${car.regNo}</td>
                <td>${car.brand}</td>
                <td>${car.model}</td>
                <td>${car.dailyPrice.toFixed(2)}</td>
                <td>${new Date(request.startDate).toLocaleDateString()}</td>
                <td>${new Date(request.endDate).toLocaleDateString()}</td>
                <td>${request.totalPrice.toFixed(2)}</td>
                <td>${request.status}</td>
            `;
            rentalHistoryBody.appendChild(row);
        }
    });
}

// Event listener for viewing rental history
document.getElementById('viewHistory').addEventListener('click', (e) => {
    e.preventDefault();
    fetchRentalHistory();
    const historyModal = new bootstrap.Modal(document.getElementById('rentalHistoryModal'));
    historyModal.show();
});
