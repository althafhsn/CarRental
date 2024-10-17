// Toggle the profile dropdown on image click
const profile = document.querySelector('.profile');
const imgProfile = document.querySelector('img');
const dropdownProfile = document.querySelector('.profile-link');

imgProfile.addEventListener('click', function () {
    dropdownProfile.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', function () {
    const signinProfile = document.getElementById('signinProfile');
    const userProfile = document.getElementById('userProfile');

    // Check if the user is authenticated by looking for a session storage item
    if (sessionStorage.getItem('isAuthenticatedUser') === 'true') {
        // If authenticated, show the user profile and hide the sign-in button
        userProfile.style.display = 'block';
        signinProfile.style.display = 'none';

        // Optionally, set the user profile image (if stored in sessionStorage)
        const profileImage = sessionStorage.getItem('profileImage');
        if (profileImage) {
            userProfile.querySelector('img').src = profileImage;
        }

    } else {
        // If not authenticated, show the sign-in button and hide the user profile
        userProfile.style.display = 'none';
        signinProfile.style.display = 'block';
    }

    // Logout functionality: when the user clicks the logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Clear session storage
            sessionStorage.removeItem('isAuthenticatedUser');
            sessionStorage.removeItem('profileImage');
            // Redirect to the sign-in page or reload to refresh the visibility
            window.location.href = 'signin.html';
        });
    }
});






// Function to open the Edit User modal
function openEditUserModal() {
    // Get the user ID from sessionStorage
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        console.error('No user ID found in session storage.');
        return;
    }

    // Fetch user details based on the userId from sessionStorage
    fetch(`http://localhost:5034/api/Customer/GetCustomerById?customerId=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            console.log('User data fetched:', user);

            // Populate form fields with the fetched user data
            document.getElementById('editUserId').value = user.customerId;
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editMobileNo').value = user.phone;
            document.getElementById('editAddress').value = user.address;
            document.getElementById('editNIC').value = user.nic;
            document.getElementById('editLicense').value = user.licence;

            // Show the modal after populating the data
            const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data. Please try again later.');
        });
}

// Function to save the edited user details
document.getElementById('saveUserChangesBtn').addEventListener('click', async function (e) {
    // e.preventDefault();  // Prevent form submission

    const userId = document.getElementById('editUserId').value;
    const updatedUserData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editMobileNo').value,
        address: document.getElementById('editAddress').value,
        licence: document.getElementById('editLicense').value,
        nic: document.getElementById('editNIC').value
    };

    // Ensure no empty fields before making request
    if (!Object.values(updatedUserData).every(value => value.trim() !== '')) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5034/api/Customer/UpdateCustomerById?customerId=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });

        if (!response.ok) {
            const errorResponse = await response.json();  // Get error details from the response
            console.error('Response error:', errorResponse);
            throw new Error('Failed to save changes');
        }

        // Log successful response
        const responseData = await response.json();
        console.log('User updated successfully:', responseData);

        // Close the modal after successful update
        const modalElement = document.getElementById('editUserModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        // Refresh the user list to reflect changes (Optional: adjust this depending on how you want to update the UI)
        fetchUsers();
        alert('User details updated successfully!');
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again later.');
    }
    window.location.reload();
});

// Function to fetch and refresh the user list (optional, if needed for updating UI after edit)
function fetchUsers() {
    // Placeholder for user list refresh functionality
    // Call your API here to refresh the user list, if needed
    console.log('Refreshing user list...')
}

async function checkForCustomerOverdueRentals() {
    try {
        // Get the logged-in customer ID from session storage
        const loggedInCustomerId = sessionStorage.getItem('userId');
        
        // Fetch all rental requests
        const response = await fetch('http://localhost:5034/api/RentalRequest/getAllRentalRequests');
        const rentals = await response.json();

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date

        // Check if the logged-in customer has any overdue rentals
        rentals.forEach(rental => {
            const rentalEndDate = new Date(rental.endDate);
            
            // Calculate the duration in days between today and the rental end date
            const duration = Math.floor((rentalEndDate - today) / (1000 * 60 * 60 * 24));

            // Check if the rental is for the logged-in customer and if it's due tomorrow
            if (rental.customerId == loggedInCustomerId && rental.status === 'active' && duration > 1) {
                alert(`Reminder: Your rental is due in ${duration} days! Rental ID: ${rental.rentalId}`);
            }
        });
    } catch (error) {
        console.error('Error fetching rental data:', error);
    }
}

// Call the function periodically, e.g., every day or at a specific interval

document.addEventListener('DOMContentLoaded',()=>{
    setInterval(checkForCustomerOverdueRentals, 24 * 60 * 60 * 1000); // Check every 24 hours

});



document.addEventListener('DOMContentLoaded', function () {
    const rentalApiUrl = ('http://localhost:5034/api/RentalRequest/getAllRentalRequests'); // Replace with your rental request API URL
    const carsApiUrl = ('http://localhost:5034/api/Car/getAllCars') // Replace with your cars API URL
    const viewHistoryLink = document.getElementById('viewHistory');
    const rentalHistoryBody = document.getElementById('rentalHistoryBody');

    // Get the logged-in user ID from session storage
    const loggedInUserId = sessionStorage.getItem('userId'); // Ensure the userId is stored in session storage
console.log(loggedInUserId);
    // Function to fetch and display rental history
    async function fetchRentalHistory() {
        try {
            // Fetch rental requests
            const rentalResponse = await fetch(rentalApiUrl);
            const rentalRequests = await rentalResponse.json();

            // Fetch cars
            const carsResponse = await fetch(carsApiUrl);
            const cars = await carsResponse.json();

            // Create a map to correlate car IDs with their details
            const carMap = {};
            cars.forEach(car => {
                carMap[car.carId] = {
                    regNo: car.regNo,
                    brand: car.brand,
                    model: car.model,
                    dailyPrice: car.dailyPrice // Assuming the car API provides price info
                };
            });

            // Clear the previous history content
            rentalHistoryBody.innerHTML = '';

            // Generate rows for the rental history of the logged-in user
            let no = 1;
            rentalRequests.forEach(request => {
                if (request.customerId == loggedInUserId) { // Show only the logged-in user's history
                    const car = carMap[request.carId]; // Get car details from the carMap

                    // Create a new row for the rental history
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${no++}</td>
                        <td>${car.regNo}</td>
                        <td>${car.brand}</td>
                        <td>${car.model}</td>
                        <td>${car.dailyPrice.toFixed(2)}</td>
                        <td>${new Date(request.startDate).toLocaleDateString()}</td>
                        <td>${new Date(request.endDate).toLocaleDateString()}</td>
                        <td>${request.totalPrice.toFixed(2)}</td>
                    `;

                    // Append the row to the table body
                    rentalHistoryBody.appendChild(row);
                }
            });
        } catch (error) {
            console.error('Error fetching rental history:', error);
            alert('Failed to load rental history. Please try again later.');
        }
    }

    // Event listener for opening the rental history modal when clicking "History"
    viewHistoryLink.addEventListener('click', function (e) {
        e.preventDefault();
        fetchRentalHistory(); // Fetch and display rental history
        const historyModal = new bootstrap.Modal(document.getElementById('rentalHistoryModal'));
        historyModal.show(); // Show the modal after fetching history
    });
});
