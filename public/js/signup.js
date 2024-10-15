// DOM Elements
const signupForm = document.getElementById('signupForm');
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const mobileNo = document.getElementById('mobileNo');
const address = document.getElementById("address");
const license = document.getElementById("license");
const nic = document.getElementById("nic");
const password = document.getElementById("password");
const cPassword = document.getElementById("cPassword");

// Function to encrypt password
function encryptPassword(password) {
    const encryptedPassword = btoa(password); // base64 encoding
    console.log(encryptedPassword);
    return encryptedPassword;
}

// Generate a random ID
function generateId(length) {
    const chars = "1234567890";
    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Fetch users from the JSON server
// Fetch users from the JSON server (Change the endpoint to the correct one)
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:5034/api/Customer/getAllCustomers'); // Adjust the endpoint
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (err) {
        console.error('Error fetching users:', err);
        return []; // Return an empty array if fetch fails
    }
}


// Submit signup form
// Submit signup form with enhanced error handling
async function submitSignup() {
    // Check if passwords match
    if (password.value !== cPassword.value) {
        alert('Passwords do not match. Please check.');
        return;
    }

    // Create user data object
    const userData = {
        customerId: generateId(27),
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        imagePath: "string",  // Temporary placeholder, ensure this is correct
        phone: mobileNo.value.trim(),
        address: address.value.trim(),
        password: encryptPassword(password.value),
        email: email.value.trim(),
        nic: nic.value.trim(),
        licence: license.value.trim()
    };

    // Check if all fields are filled
    if (!Object.values(userData).every(value => value.trim() !== '' && value !== null)) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        // Fetch existing users to check for duplicate license, NIC, email, or mobile number
        const users = await fetchUsers();
        console.log('Users fetched:', users); // Debug: Check the fetched users
        
        const userExists = users.some(user => 
            user.license === userData.licence || 
            user.nic === userData.nic || 
            user.email === userData.email || 
            user.mobileNo === userData.phone
        );

        // If license, NIC, email, or mobile already exists, block the submission
        if (userExists) {
            alert('A user with this NIC, License, Email, or Mobile No already exists.');
            return; // Stop the submission
        }

        // Submit the data if no duplicates are found
        const response = await fetch('http://localhost:5034/api/Customer/addCustomer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const responseData = await response.json();
        console.log('Server response:', responseData);
        
        if (response.ok) {
            alert('User added successfully!');
            signupForm.reset();
            window.location.href = "./signin.html";
        } else {
            console.error('Error response:', responseData);
            alert('Failed to add user. Error: ' + responseData.message || 'Unknown error');
        }
        
    } catch (error) {
        console.error('Error submitting the signup form:', error);
        alert('Error adding the user. Please try again.');
    }
}


// Add event listener for form submission
signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await submitSignup();
    window.location.href = "./signin.html"; // Redirect to sign-in page
});

