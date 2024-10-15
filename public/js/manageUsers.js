// Fetch users from the JSON server
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:5000/users');
        if (!response.ok) { throw new Error('Failed to fetch users') };
        const users = await response.json();
        displayUsersInTable(users);
    } catch (err) {
        console.error('Error fetching users:', err);
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
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td>${user.mobileNo}</td>
            <td>${user.license}</td>
            <td>${user.nic}</td>
            <td>
                <button class="btn btn-outline-primary edit-btn" data-user-id="${user.id}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button> 
                <button class="btn btn-outline-danger delete-btn" data-user-id="${user.id}">
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


// Fnc to open edit modal for cars

async function openUserEditModal(userId) {
    try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
        if (!response.ok) {
            throw new Error('User Not Found');
        }
        const user = await response.json();
    

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editMobileNo').value = user.mobileNo;
        document.getElementById("editAddress").value = user.address;
        document.getElementById('editNIC').value = user.nic;
        document.getElementById('editLicense').value = user.license;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching user details for editing :', error);
        alert('Fail to load user Details');
    }
}


document.getElementById('saveUserChangesBtn').addEventListener('click', async function () {
    const userId = document.getElementById('editUserId').value;
    const updatedUserData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        mobileNo: document.getElementById('editMobileNo').value,
        address: document.getElementById("editAddress").value,
        license: document.getElementById('editLicense').value,
        nic: document.getElementById('editNIC').value
    };
    try {
        const response = await fetch(`http://localhost:5000/users/${userId}`,{
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });
        if (!response.ok) throw new Error('Failed to save changes');

        // Close the modal after successful update
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();

        // Refresh the user list to reflect changes
        fetchUsers();
        alert('User details updated successfully!');
    } catch(error){
        console.error('Error saving user details:', error);
        alert('Failed to save changes.');
    }
});

async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete User');
        }

        alert('User deleted successfully');
        fetchUsers(); // Refresh the car table
    }catch (error) {
        console.error('Error deleting user:', error);
        alert('There was an error deleting the User.');
    }
}
