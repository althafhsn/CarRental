// Fetch users from the JSON server
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:5034/api/Customer/getAllCustomers');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        displayUsersInTable(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        alert('Error fetching users. Please try again later.');
        return [];
    }
}

// Display users in the table
function displayUsersInTable(users) {
    const tableBody = document.querySelector('#UserTable tbody');
    tableBody.innerHTML = '';

    // Loop through the users and add them to the table
    users.forEach((user, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.customerId}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.licence}</td>
            <td>${user.nic}</td>
            <td>
                <button class="btn btn-outline-primary edit-btn" data-user-id="${user.customerId}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button> 
                <button class="btn btn-outline-danger delete-btn" data-user-id="${user.customerId}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listeners for Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const userId = event.target.closest('button').getAttribute('data-user-id');
            openUserEditModal(userId);
        });
    });

    // Add event listeners for Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const userId = event.target.closest('button').getAttribute('data-user-id');
            deleteUser(userId);
        });
    });
}

// Function to run after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Fetch and display users when the page loads
});

// Function to open edit modal for users
async function openUserEditModal(userId) {
    try {
        const response = await fetch(`http://localhost:5034/api/Customer/GetCustomerById?customerId=${userId}`);
        if (!response.ok) {
            throw new Error(`User not found (status: ${response.status})`);
        }

        const user = await response.json();

        // Populate the edit modal with user details
        document.getElementById('editUserId').value = user.customerId;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editMobileNo').value = user.phone;
        document.getElementById("editAddress").value = user.address;
        document.getElementById('editNIC').value = user.nic;
        document.getElementById('editLicense').value = user.licence;

        // Show the modal (ensure it's properly initialized)
        const modalElement = document.getElementById('editUserModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } catch (error) {
    }
}

// Event listener for saving edited user details
document.getElementById('saveUserChangesBtn').addEventListener('click', async function () {
    const userId = document.getElementById('editUserId').value;
    const updatedUserData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editMobileNo').value,
        address: document.getElementById("editAddress").value,
        licence: document.getElementById('editLicense').value,
        nic: document.getElementById('editNIC').value
    };

    try {
        const response = await fetch(`http://localhost:5034/api/Customer/UpdateCustomerById/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });
        if (!response.ok) throw new Error('Failed to save changes');

        // Close the modal after successful update
        const modalElement = document.getElementById('editUserModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        // Refresh the user list to reflect changes
        fetchUsers();
        alert('User details updated successfully!');
    } catch (error) {
  
        alert('Failed to save changes. Please try again later.');
    }
});

// Function to delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:5034/api/Customer/DeleteById/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user (status: ${response.status})`);
        }

        alert('User deleted successfully');
        fetchUsers(); // Refresh the user table after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('There was an error deleting the user. Please try again later.');
    }
}
