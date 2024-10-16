function encryptPassword(password) {
    const encryptedPassword = btoa(password); // base64 encoding
    console.log(encryptedPassword);
    return encryptedPassword;
}

document.getElementById('signinForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nicOrLicense = document.getElementById('nicOrLicense').value;
    const password = document.getElementById('userPassword').value;
    // const errorMsg = document.getElementById('errorMsg'); // Ensure you have this element for error messages

    // Fetch the list of users from the server
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:5034/api/Customer/getAllCustomers'); // Assuming your API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const users = await response.json();
            console.log(users); // Log users to verify their structure
            return users;
        } catch (error) {
            console.error('Error fetching user details:', error);
            // errorMsg.textContent = 'Error fetching user details. Please try again later.';
            // errorMsg.classList.remove('d-none');
            return []; // Return an empty array on error to avoid undefined
        }
    }

    // Call the function to fetch users
    const users = await fetchUsers();
console.log (users);
    // Debugging output
    console.log("Entered NIC/License:", nicOrLicense);
    console.log("Entered Password:", password);
    console.log("Users Fetched:", users);

    // Simulate server-side authentication by matching user details
    const matchedUser = users.find(user => 
        (user.nic === nicOrLicense || user.licence === nicOrLicense) && user.password === encryptPassword(password)
    );

    console.log(matchedUser);

    if (matchedUser) {
        // Store the user ID and details in sessionStorage upon successful login
        sessionStorage.setItem('isAuthenticatedUser', 'true');
        sessionStorage.setItem('userId', matchedUser.customerId); // Store the user ID
        sessionStorage.setItem('userDetails', JSON.stringify(matchedUser)); // Store the entire user details

        alert("NIC or License or Password correct")

        // Redirect the user back to the previous page they were on
        const previousPage ='index.html'; // Default to home if no previous page
        window.location.href = previousPage;
    } else {
        // Show error message if no user matched
        // errorMsg.textContent = 'Invalid NIC/License or password.';
        // errorMsg.classList.remove('d-none');
        alert("NIC or License or Password incorrect")
    }
});