

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


async function updateRentalRequestStatus(requestId, status) {
    try {
        // Send the PUT request to update the status
        const response = await fetch('http://localhost:5034/api/RentalRequest/updateStatus', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rentalId: requestId, status })
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
            statusContainer.innerHTML = `<span class="badge bg-${status === 'Approved' ? 'success' : 'danger'}">${status}</span>`;
        }

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
        const status = approveButton ? 'Approved' : 'Rejected';

        // Call the function to update the rental request status
        updateRentalRequestStatus(requestId, status);
    }
});

// Function to display the rental requests in the table
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
              ${request.status === 'Approved' || request.status === 'Rejected' ? 
                  `<span class="badge bg-${request.status === 'Approved' ? 'success' : 'danger'}">${request.status}</span>` :
                  ` 
                  <button class="btn btn-outline-primary edit-btn" data-request-id="${request.rentalId}">
                      <i class="fa-solid fa-check"></i>
                  </button> 
                  <button class="btn btn-outline-danger edit-btn" data-request-id="${request.rentalId}">
                      <i class="fa-solid fa-xmark"></i>
                  </button>
                  `
              }
          </td>
          <td>
              <button class="btn btn-outline-primary return-btn" data-rental-id="${request.rentalId}" ${request.status === 'Approved' ? '' : 'disabled'}onclick="handleReturnButtonClick('rentalId')">
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
// DOM Elements
const carForm = document.getElementById('carForm');
const carBrand = document.getElementById('carBrand');
const carName = document.getElementById('carName');
const gearType = document.getElementById('gearType');
const seatCount = document.getElementById('seatCount');
const fuelType = document.getElementById('fuelType');
const mileage = document.getElementById('mileage');
const regNo = document.getElementById('regNo');
const carYear = document.getElementById('carYear');
const dayPrice = document.getElementById('dayPrice');
const hourPrice = document.getElementById('hourPrice');
const addNewBrandInput = document.getElementById('addNewBrand');
const addNewCarNameInput = document.getElementById('addNewCarName');

// Dropdown options
const GearTypeDropdown = ["Auto", "Manual"];
const fuelTypeDropdown = ["Petrol", "Diesel", "Electric"];
const seatCountDropdown = Array.from({ length: 12 }, (_, i) => i + 1);

// Fetch car models from JSON server
async function fetchCarModels() {
    try {
        const response = await fetch('http://localhost:5000/newCars');
        if (!response.ok) throw new Error('Failed to fetch car models');
        return await response.json();
    } catch (err) {
        console.error('Error fetching car models:', err);
        return [];
    }
}

// Populate car brands dropdown
async function populateCarBrands() {
    const carModels = await fetchCarModels();
    carBrand.innerHTML = '<option value="" disabled selected>Choose A Car Brand</option>';
    carModels.forEach(car => {
        const option = document.createElement('option');
        option.value = car.brand;
        option.textContent = car.brand;
        carBrand.appendChild(option);
    });
}

// Populate car names based on selected brand
carBrand.addEventListener('change', async function () {
    const selectedBrand = this.value;
    carName.innerHTML = '<option value="" disabled selected>Choose A Car Name</option>';

    const carModels = await fetchCarModels();
    const brandData = carModels.find(car => car.brand === selectedBrand);

    if (brandData) {
        brandData.models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            carName.appendChild(option);
        });
    }
});

function generateId(length) {
    const chars = "1234567890";
    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

async function addNewCar() {
    const newBrand = addNewBrandInput.value.trim();

    if (!newBrand) {
        alert('Brand name cannot be empty.');
        return;
    }

    const carModels = await fetchCarModels();
    const existingBrand = carModels.find(car => car.brand === newBrand);

    if (!existingBrand) {
        try {
            const response = await fetch('http://localhost:5000/newCars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brand: newBrand, models: [] })
            });

            if (response.ok) {
                addNewBrandInput.value = '';
                const option = document.createElement('option');
                option.value = newBrand;
                option.textContent = newBrand;
                carBrand.appendChild(option); // Dynamically update the dropdown
                alert('Brand added successfully!');
            } else {
                alert('Failed to add the brand.');
            }
        } catch (error) {
            console.error('Error adding new brand:', error);
            alert('Error adding brand. Please try again.');
        }
    } else {
        alert('Brand already exists.');
    }
}

// Add a new car model to an existing brand
async function addNewModel() {
    const selectedBrand = carBrand.value;
    const newModel = addNewCarNameInput.value.trim();

    if (!selectedBrand || !newModel) {
        alert('No brand selected or model input is empty.');
        return;
    }

    const carModels = await fetchCarModels();
    const brandData = carModels.find(car => car.brand === selectedBrand);

    if (brandData && !brandData.models.includes(newModel)) {
        try {
            const response = await fetch(`http://localhost:5000/newCars/${brandData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ models: [...brandData.models, newModel] })
            });

            if (response.ok) {
                addNewCarNameInput.value = '';
                const option = document.createElement('option');
                option.value = newModel;
                option.textContent = newModel;
                carName.appendChild(option); // Dynamically update the car names dropdown
                alert(`Model '${newModel}' added successfully to brand '${selectedBrand}'.`);
            } else {
                alert('Failed to add model.');
            }
        } catch (error) {
            console.error('Error adding new model:', error);
            alert('Error adding model. Please try again.');
        }
    } else {
        alert('Model already exists or invalid brand.');
    }
}
async function checkRegistrationNumberExists(regNo) {
try {
    const response = await fetch('http://localhost:5034/api/Car/getAllCars');
    if (!response.ok) throw new Error('Failed to fetch cars');
    const cars = await response.json();
    return cars.some(car => car.regNo === regNo); // Check if regNo exists
} catch (error) {
    console.error('Error checking registration number:', error);
    return false;
}
}
// Submit car form and add a new car
async function submitCarForm() {
  
    const imageInput = document.getElementById('logo-id');
    const file = imageInput.files[0];
    const regNoValue = regNo.value.trim();

    // Check if the registration number exists
    const regExists = await checkRegistrationNumberExists(regNoValue);
    if (regExists) {
        alert('This registration number already exists. Please enter a unique registration number.');
        return;
    }

    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const base64Image = await getBase64(file);

    const carData = {
        carId: generateId(8),
        imagePath: base64Image,
        brand: carBrand.value,
        model: carName.value,
        gearType: gearType.value,
        seatCount: seatCount.value,
        fuelType: fuelType.value,
        mileage: mileage.value,
        year: carYear.value,
        regNo: regNo.value,
        dailyPrice: dayPrice.value
    };

    if (!Object.values(carData).every(value => value.trim() !== '' && value !== null)) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5034/api/Car/Add-car', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });


        if (response.ok) {
            alert('Car added successfully!');
            carForm.reset();
        } else {
            throw new Error('Failed to add car.');
        }
    } catch (error) {

        alert('Error adding the car. Please try again.');
    }


    window.location.reload();
}

// Convert image file to Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Populate dropdowns for gear types, seat counts, and fuel types
function populateDropdown(dropdown, options) {
    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        dropdown.appendChild(option);
    });
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    populateCarBrands();
    populateDropdown(gearType, GearTypeDropdown);
    populateDropdown(fuelType, fuelTypeDropdown);
    populateDropdown(seatCount, seatCountDropdown);
});

// Event listeners for adding new brand and model
document.getElementById('btnAddNewName').addEventListener('click', (e) => {
    e.preventDefault();
    addNewModel();
});
document.getElementById('btnAddNewBrand').addEventListener('click', (e) => {
    e.preventDefault();
    addNewCar();
});

// Submit form event listener
carForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission
    await submitCarForm(); // Call submit function
    carForm.reset();
});


// Add Cars

// Car Table view
async function fetchCars() {
    try {
        const response = await fetch('http://localhost:5034/api/Car/getAllCars');
        if (!response.ok) {
            throw new Error('Failed to fetch car details');
        }
        const cars = await response.json();
        displayCarsInTable(cars);
    } catch (error) {
        console.error('Error fetching car Details: ', error);
    }

}


function displayCarsInTable(cars) {
    const tableBody = document.querySelector('#carTable tbody');
    tableBody.innerHTML = '';

    // loop the cars 
    cars.forEach((car, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${car.carId}</td>
                    <td>${car.regNo}</td>
                    <td style="text-align: center;"><img src="${car.imagePath}" alt="" style="width: 36px; height: 36px; border-radius: 10%; "></td>
                    <td>${car.brand}</td>
                    <td>${car.model}</td>
                    <td>${car.gearType}</td>
                    <td>${car.seatCount}</td>
                    <td>${car.fuelType}</td>
                    <td>${car.mileage}</td>
                    <td>${car.dailyPrice}</td>
                    <td>
                        <button class="btn btn-outline-primary car-edit-btn" data-car-id="${car.carId}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button> 
                        <button class="btn btn-outline-danger car-delete-btn" data-car-id="${car.carId}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>

                    `;

        tableBody.appendChild(row);


    });

    // Add event listeners for Edit buttons
    document.querySelectorAll('.car-edit-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const carId = event.target.closest('button').getAttribute('data-car-id');
            openCarEditModal(carId);
        });
    });

    document.querySelectorAll('.car-delete-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const carId = event.target.closest('button').getAttribute('data-car-id');
            deleteCar(carId);
        });
    });

}

// Fnc to open edit modal for each car id

async function openCarEditModal(carId) {
    try {
        const response = await fetch(`http://localhost:5034/api/Car/GetCarById?carId=${carId}`);
        if (!response.ok) throw new Error('Car Not Found');
        const car = await response.json();

        // Populate modal fields with the car data
        document.getElementById('editCarId').value = car.carId;
        document.getElementById('editCarBrand').value = car.brand;
        document.getElementById('editCarName').value = car.model;
        document.getElementById('editCarGearType').value = car.gearType;
        document.getElementById('editCarSeatCount').value = car.seatCount;
        document.getElementById('editCarFuelType').value = car.fuelType;
        document.getElementById('editCarMileage').value = car.mileage;
        document.getElementById('editCarYear').value = car.year;
        document.getElementById('editCarRegNo').value = car.regNo;        
        document.getElementById('editCarDayPrice').value = car.dailyPrice;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editCarModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching car details for editing:', error);
        alert('Failed to load car details.');
    }
}

// Save changes to the car
document.getElementById('saveCarChangesBtn').addEventListener('click', async function () {  // Prevent default form submission if inside a form

    const carId = document.getElementById('editCarId').value;
    console.log(carId)
    const updatedCarData = {
        brand:document.getElementById('editCarBrand').value,
        model:document.getElementById('editCarName').value,
        gearType:document.getElementById('editCarGearType').value,
        seatCount:document.getElementById('editCarSeatCount').value,
        fuelType:document.getElementById('editCarFuelType').value,
        mileage:document.getElementById('editCarMileage').value,
        year:document.getElementById('editCarYear').value,
        regNo:document.getElementById('editCarRegNo').value,      
        dailyPrice:document.getElementById('editCarDayPrice').value
    };

    // Ensure no fields are empty before making the update request
    if (!Object.values(updatedCarData).every(value => value.trim() !== '')) {
        alert('Please fill out all required fields.');
        return;
    }
  

    try {
        const response = await fetch(`http://localhost:5034/api/Car/UpdateCarById?carId=${carId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCarData)
        });
        console.log(carId);

        if (!response.ok) {
            const errorResponse = await response.json();  // Get the detailed error response from the server
            console.error('Error response from server:', errorResponse);
            throw new Error('Failed to save changes');
        }

        // Log successful response if needed
        const responseData = await response.json();
        console.log('Car updated successfully:', responseData);

        // Close the modal after successful update
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCarModal'));
        modal.hide();

        // Refresh the car list to reflect changes (if necessary, update the list after editing)
        fetchCars();

        alert('Car details updated successfully!');
    } catch (error) {
        console.error('Error saving car details:', error);
        alert('Failed to save changes. Please try again later.');
    }
});


async function deleteCar(carId) {
    console.log(carId)
    try {
        const response = await fetch(`http://localhost:5034/api/Car/DeleteById?carId=${carId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete car');
        }
console.log(carId);
        alert('Car deleted successfully');
        fetchCars(); // Refresh the car table
    } catch (error) {
        console.error('Error deleting car:', error);
        alert('There was an error deleting the car.');
    }
}



// Car Table view
document.addEventListener('DOMContentLoaded', () => {
    fetchCars();
})

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
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.address}</td>
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
      document.getElementById('editMobileNo').value = user.phone;
      document.getElementById("editAddress").value = user.address;
      document.getElementById('editEmail').value = user.email;
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
      phone: document.getElementById('editMobileNo').value,
      address: document.getElementById("editAddress").value,
      email: document.getElementById('editEmail').value,
      nic: document.getElementById('editNIC').value,
      licence: document.getElementById('editLicense').value
  };

  try {
      const response = await fetch(`http://localhost:5034/api/Customer/UpdateCustomerById?customerId=${userId}`, {
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
  window.location.reload();

});

// Function to delete a user
async function deleteUser(userId) {
  try {
      const response = await fetch(`http://localhost:5034/api/Customer/DeleteById?customerId=${userId}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error(`Failed to delete user (status: ${response.status})`);
      }
console.log(userId);
      alert('User deleted successfully');
      fetchUsers(); // Refresh the user table after deletion
  } catch (error) {
      console.error('Error deleting user:', error);
      alert('There was an error deleting the user. Please try again later.');
  }
} 



