async function fetchRentalRequest() {
    try {
        const response = await fetch('http://localhost:5000/rentalRequest');
        if (!response.ok) { 
            throw new Error('Failed to fetch Request'); 
        }
        const request = await response.json();
        displayRentalRequest(request); // Corrected the function call
    } catch (err) {
        console.error('Error fetching Request:', err);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRentalRequest();
});



function displayRentalRequest(requests) {
    const tableBody = document.querySelector('#rentalTable tbody');
    tableBody.innerHTML = ''; // Clear the existing rows

    requests.forEach((request, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${request.id}</td>
            <td><a href="#" class="customer-id-link" data-customer-id="${request.customerId}">${request.customerId}</a></td>
            <td><a href="#" class="car-id-link" data-car-id="${request.carId}">${request.carId}</a></td>
            <td>${request.startDate}</td>
            <td>${request.endDate}</td>
            <td>${request.duration}</td>
            <td>${request.amount}</td>
            <td>wddw</td>
            <td>
                <button class="btn btn-outline-primary edit-btn" data-request-id="${request.id}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button> 
                <button class="btn btn-outline-danger delete-btn" data-request-id="${request.id}">
                    <i class="fa-solid fa-trash"></i>
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
}

// Function to fetch and display customer details in a modal
async function openCustomerDetailsModal(userId) {
    try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
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
                        <input type="text" class="form-control" id="editMobileNo" disabled  placeholder="${customer.mobileNo}">
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
                        <input type="text" class="form-control" id="editLicense" disabled placeholder="${customer.license}">
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
        const response = await fetch(`http://localhost:5000/cars/${carId}`);
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
                        <img class="thumbnail img-preview" src="${car.image}">
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
                        <input class="form-control" disabled placeholder="${car.name}" >
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
                          <input class="form-control" disabled placeholder="${car.dayPrice}" >
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




