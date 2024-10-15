const profile = document.querySelector('.profile');
const imgProfile = document.querySelector('img');
const dropdownProfile = document.querySelector('.profile-link');


imgProfile.addEventListener('click', function () {
    dropdownProfile.classList.toggle('show');
});
document.addEventListener('DOMContentLoaded', function() {
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
        logoutButton.addEventListener('click', function() {
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
    fetch(`http://localhost:5000/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            // Check if user data is retrieved correctly
            console.log('User data fetched:', user);

            // Populate form fields with the fetched user data
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editMobileNo').value = user.mobileNo;
            document.getElementById('editAddress').value = user.address;
            document.getElementById('editNIC').value = user.nic;
            document.getElementById('editLicense').value = user.license;

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
function saveUserChanges() {
    // Get the user ID from sessionStorage
    const userId = sessionStorage.getItem('userId'); 

    if (!userId) {
        console.error('No user ID found in session storage.');
        return;
    }

    // Prepare the updated user data from form inputs
    const updatedUser = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        mobileNo: document.getElementById('editMobileNo').value,
        address: document.getElementById('editAddress').value,
        nic: document.getElementById('editNIC').value,
        license: document.getElementById('editLicense').value
    };

    if (!Object.values(updatedUser).every(value => value.trim() !== '' && value !== null)) {
        alert('Please fill out all required fields.');
        return;
    }

    // Send a PUT request to update user details in the database
    fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error updating user: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User updated successfully:', data);
        
        // Close the modal after successful update
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        editModal.hide();

        // Optionally reload the page or update the UI to reflect the changes
        // location.reload();
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Failed to update user data. Please try again.');
    });
}

// Attach the save function to the "Save Changes" button
document.getElementById('saveUserChangesBtn').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent form submission
    saveUserChanges();
});




