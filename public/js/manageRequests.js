

window.onload = () => {
  initializeSearch();
};

function initializeSearch() {
  const searchInput = document.querySelector('.form-group input'); // The search input field

  if (!searchInput) {
    console.error("Search input field not found!");
    return;
  }

  // Get the rows of the tables that you want to search through
  const carTableRows = document.querySelectorAll('#carTable tbody tr');
  const customerTableRows = document.querySelectorAll('#UserTable tbody tr');
  const reportTableRows = document.querySelectorAll('#rentalTable tbody tr');

  // Log to ensure rows are being captured
  console.log("carTableRows:", carTableRows);
  console.log("customerTableRows:", customerTableRows);
  console.log("reportTableRows:", reportTableRows);

  // Single event listener for real-time search input
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    console.log("Search value:", searchValue); // Log the search value to ensure input is being captured

    // Search in all tables when the input changes
    searchTable(carTableRows, searchValue);
    searchTable(customerTableRows, searchValue);
    searchTable(reportTableRows, searchValue);
  });
}

// Search Functionality
function searchTable(tableRows, searchValue) {
  if (!tableRows) {
    console.error("Table rows not found");
    return;
  }

  tableRows.forEach((row, i) => {
    const rowData = row.textContent.toLowerCase(); // Get the text content of the row
    console.log("Row data:", rowData); // Log each row's data

    // Hide or show the row based on the search value
    if (rowData.includes(searchValue)) {
      row.classList.remove('hide');  // Show the row if it matches
    } else {
      row.classList.add('hide');  // Hide the row if it doesn't match
    }

    // Optional: Apply staggered animation
    row.style.setProperty('--delay', `${i / 25}s`);
  });

  // Alternate background color for visible rows
  document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
    visibleRow.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#f0f0f0'; // Set alternating colors
  });
}

// Initialize the search when the page is loaded


async function updateRentalRequestAction(requestId, action) {
  try {
    // Send the PUT request to update the status
    const response = await fetch('http://localhost:5034/api/RentalRequest/updateAction', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rentalId: requestId, action })
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    const result = await response.json();
    console.log(result.message);

    // Optionally, update the UI to reflect the status change
    const statusContainer = document.querySelector(`#status-container-${requestId}`);
    if (statusContainer) {
      // Replace the buttons with the status text
      statusContainer.innerHTML = `<span class="badge bg-${action === 'Approved' ? 'success' : 'danger'}">${action}</span>`;
    }

  } catch (error) {
    console.error('Error updating status:', error);
  }
}

async function updateRentalRequestStatus(carId, carStatus) {
  try {
    // Send the PUT request to update the status
    const response = await fetch(`https://localhost:5043/api/Car/UpdateStatusCarById?carId=${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ carStatus })
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    const result = await response.json();
    console.log(result.message);

  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// Event listener for status update (approve or reject)
document.addEventListener('click', (event) => {
  // Check if the clicked element is an approve or reject button
  const approveButton = event.target.closest('.fa-check');
  const rejectButton = event.target.closest('.fa-xmark');

  if (approveButton || rejectButton) {
    const requestId = event.target.closest('.edit-btn').getAttribute('data-request-id');
    const carId = event.target.closest('.edit-btn').getAttribute('data-car-id');
    const action = rejectButton ? 'Rejected' : 'Approved';
    const status = approveButton ? 'd-none' : 'show'

    console.log(carId)
    // Call the function to update the rental request status
    updateRentalRequestAction(requestId, action);
    updateRentalRequestStatus(carId, status)

    

  }
});

// Function to display the rental requests in the table
function displayRentalRequest(requests) {
  const tableBody = document.querySelector('#rentalTable tbody');
  tableBody.innerHTML = ''; // Clear the existing rows

  requests.forEach((request, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
          <td>${index + 1}</td>
          <td>${request.rentalId}</td>
          <td>${request.requestDate}</td>
          <td><a href="#" class="customer-id-link" data-customer-id="${request.customerId}">${request.customerId}</a></td>
          <td><a href="#" class="car-id-link" data-car-id="${request.carId}">${request.carId}</a></td>
          <td>${request.startDate}</td>
          <td>${request.endDate}</td>
          <td>${request.duration}</td>
          <td>${request.totalPrice}</td>
          <td id="status-container-${request.rentalId}">
              ${request.action === 'Approved' || request.action === 'Rejected' ?
        `<span class="badge bg-${request.action === 'Approved' ? 'success' : 'danger'}">${request.action}</span>` :
        ` 
                  <button class="btn btn-outline-primary edit-btn" data-request-id="${request.rentalId}" data-car-id="${request.carId}">
                      <i class="fa-solid fa-check"></i>
                  </button> 
                  <button class="btn btn-outline-danger edit-btn" data-request-id="${request.rentalId}" data-car-id="${request.carId}">
                      <i class="fa-solid fa-xmark"></i>
                  </button>
                  `
      }
          </td>
          <td>
              <button class="btn btn-outline-primary return-btn" data-rental-id="${request.rentalId}" ${request.action === 'Rejected' ? 'disabled' : ''}onclick="handleReturnButtonClick('rentalId')">
                  Return
              </button>
          </td>
      `;

    tableBody.appendChild(row);
  });

  // Attach click event listeners for customerId and carId links
  document.querySelectorAll('.customer-id-link').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const customerId = event.target.getAttribute('data-customer-id');
      openCustomerDetailsModal(customerId); // Function to open customer modal
    });
  });

  document.querySelectorAll('.car-id-link').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const carId = event.target.getAttribute('data-car-id');
      openCarDetailsModal(carId); // Function to open car modal
    });
  });

  // Attach click event listeners for return buttons
  document.querySelectorAll('.return-btn').forEach(button => {
    button.addEventListener('click', function () {
      const rentalId = this.getAttribute('data-rental-id');
      console.log(`Return clicked for Rental ID: ${rentalId}`);

      // Change the button text to "Returned"
      this.textContent = 'Returned';
      this.classList.add('btn-success'); // Optional: Add a class to change button color
      this.disabled = true; // Disable the button after it's clicked
    });
  });
}

// Fetch and display rental requests on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchRentalRequest();
});

// Fetch rental requests from the backend API
async function fetchRentalRequest() {
  try {
    const response = await fetch('http://localhost:5034/api/RentalRequest/getAllRentalRequests');
    if (!response.ok) {
      throw new Error('Failed to fetch Request');
    }
    const requests = await response.json();
    displayRentalRequest(requests); // Call the function to display the requests
  } catch (err) {
    console.error('Error fetching Request:', err);
    return [];
  }
}



// Function to fetch and display customer details in a modal
async function openCustomerDetailsModal(userId) {
  try {
    const response = await fetch(`http://localhost:5034/api/Customer/GetCustomerById?customerId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch customer details');

    const customer = await response.json();

    // Create the modal HTML dynamically
    const modalHTML = `
            <div class="modal fade" id="dynamicCustomerModal" tabindex="-1" aria-labelledby="customerModalLabel" aria-hidden="true">
                 <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="customerModalLabel">Customer Details</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div>

        </div>
        <div class="modal-body">
            <form id="editUserForm" class="row g-3">
                <div class="col-12 d-flex flex-column flex-md-row">
                  <div class="form-group w-100 align-items-center">
                  <div class="main-img-preview mb-3">
                    <img class="thumbnail img-preview" src="assets/undraw_login_re_4vu2.svg"width="400px">
                  </div>
                  <!-- Other Details Section -->
                  <div class="row mb-3">
                    <div class="col-md-6 ">
                      <label value="" disabled selected>FirstName</label>
                      <input type="text" class="form-control" id="editFirstName" disabled placeholder="${customer.firstName}">
                    </div>
                    <div class="col-md-6 ">
                      <label value="" disabled selected>LastName</label>
                      <input type="text" class="form-control" id="editLastName" disabled  placeholder="${customer.lastName}">
                    </div>
                    <div class="col">
                      <div class=" mb-3">
                        <label value="" disabled selected>Email Address</label>
                        <input type="email" class="form-control" id="editEmail" disabled  placeholder="${customer.email}">
                      </div>
                    </div>
                   
                      <div class="mb-3">
                        <label value="" disabled selected>Mobile Number</label>
                        <input type="text" class="form-control" id="editMobileNo" disabled  placeholder="${customer.phone}">
                      </div>
                 
                    <div class="mb-3">
                      <label value="" disabled selected>Address</label>
                      <input type="text" class="form-control" id="editAddress" disabled  placeholder="${customer.address}">
                    </div>

                    <div class="row mb-3">
                      <div class="col-6">
                        <label value="" disabled selected>NIC Number</label>
                        <input type="text" class="form-control" id="editNIC" disabled placeholder="${customer.nic}">
                      </div>
                      <div class="col-6">
                        <label value="" disabled selected>License</label>
                        <input type="text" class="form-control" id="editLicense" disabled placeholder="${customer.licence}">
                      </div>
                    </div>

                  </div>
                </div>
              </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        
        </div>
      </div>
    </div>
            </div>
        `;

    // Remove any existing modal and append the new one to the body
    const existingModal = document.getElementById('dynamicCustomerModal');
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show the modal
    const customerModal = new bootstrap.Modal(document.getElementById('dynamicCustomerModal'));
    customerModal.show();

  } catch (error) {
    console.error('Error fetching customer details:', error);
  }
}

// Function to fetch and display car details in a modal
async function openCarDetailsModal(carId) {
  try {
    const response = await fetch(`http://localhost:5034/api/Car/GetCarById?carId=${carId}`);
    if (!response.ok) throw new Error('Failed to fetch car details');

    const car = await response.json();

    // Create the modal HTML dynamically
    const modalHTML = `
             <div class="modal fade" id="dynamicCarModal" tabindex="-1" aria-labelledby="carModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 70%;">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h1 class="modal-title fs-5" id="carModalLabel">Car Details</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="border: none;">
              <form id="carForm" class="row g-3">
                <div class="col-12 d-flex flex-column flex-md-row">
                  <!-- Image Upload Section -->
                  <div class="col-md-6 d-flex align-items-center mb-3">
                    <div class="form-group w-100 align-items-center">
                      <div class="main-img-preview mb-3">
                        <img class="thumbnail img-preview" src="${car.imagePath}">
                      </div>
                    </div>
                  </div>

                  <!-- Other Details Section -->
                  <div class="col-md-6">
                    <div class="col">
                      <div class="mb-3">
                        <label for="editCarBrand" class="form-label border-"> Car Brand</label>
                        <input class="form-control" disabled placeholder="${car.brand}" >
                      </div>
                    </div>

                    <div class="col">
                      <div class="mb-3">
                        <label for="editCarBrand" class="form-label border-">Car Modal</label>
                        <input class="form-control" disabled placeholder="${car.model}" >
                      </div>
                    </div>


                    <div class="row mb-3">
                      <div class="col-3">
                        <label for="editCarGearType" class="form-label border-"> Gear Type</label>
                        <input class="form-control" disabled placeholder="${car.gearType}" >
                      </div>
                      <div class="col-3">
                        <label for="editCarSeatCount" class="form-label border-"> seat Count</label>
                        <input class="form-control" disabled placeholder="${car.seatCount}" >

                      </div>
                      <div class="col-3">
                        <label for="editCarFuelType" class="form-label border-">Fuel Type</label>
                        <input class="form-control" disabled placeholder="${car.fuelType}" >
                      </div>
                      <div class="col-3">
                        <label for="editCarYear" class="form-label border-">Car Year</label>

                        <input class="form-control" disabled placeholder="${car.year}" >
                      </div>

                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="editCarMileage" class="form-label border-"> Milage/Litre</label>
                        <input class="form-control" disabled placeholder="${car.milage}" >
                      </div>
                      <div class="col-md-6">
                        <label for="editCarRegNo" class="form-label border-"> Reg No</label>
                        <input class="form-control" disabled placeholder="${car.regNo}" >
                      </div>


                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="editCarDayPrice" class="form-label border-">Day Price</label>
                          <input class="form-control" disabled placeholder="${car.dailyPrice}" >
                        </div>
                        <div class="col-md-6">
                          <label for="editCarHourPrice" class="form-label border-">Hour Price</label>
                          <input class="form-control" disabled placeholder="" >
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

        `;

    // Remove any existing modal and append the new one to the body
    const existingModal = document.getElementById('dynamicCarModal');
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show the modal
    const carModal = new bootstrap.Modal(document.getElementById('dynamicCarModal'));
    carModal.show();

  } catch (error) {
    console.error('Error fetching car details:', error);
  }
}