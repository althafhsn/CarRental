// Function to fetch and display cars based on filter criteria
async function fetchAndDisplayCars(filterCriteria = {}) {
    try {
        const response = await fetch('http://localhost:5034/api/Car/getAllCars');
        if (!response.ok) throw new Error('Failed to fetch car details');

        const cars = await response.json();
        const showCarCard = document.getElementById('showCarsCards');
        showCarCard.innerHTML = ''; // Clear existing cards

        // Filter cars based on criteria (if any)
        const filteredCars = cars.filter(car => {
            const matchesBrand = filterCriteria.brand ? car.brand.toLowerCase() === filterCriteria.brand.toLowerCase() : true;
            const matchesPrice = filterCriteria.dayPrice ? parseFloat(car.dayPrice) <= parseFloat(filterCriteria.dayPrice) : true;

            return matchesBrand && matchesPrice; // Both brand and price conditions must match
        });

        // Only display cars if there are filtered results
        if (filteredCars.length > 0) {
            // Loop through each filtered car and create the card HTML
            filteredCars.forEach(car => {
                const cardHTML = `
                    <div class="col ">
                        <div class="card car-card ${car.carStatus}">
                            <label class="form-label d-none">${car.carId}</label>
                            <div class="col-12">
                                <img src="${car.imagePath}" class="card-img-top" alt="${car.model}">
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-title mb-0">${car.brand} ${car.model}</h5>
                                    <span class="dashed-border">${car.year}</span>
                                </div>
                                <div class="container">
                                    <div class="row text-center car-info-section">
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-user car-info-icon"></i>
                                            <span class="p-2">${car.seatCount} People</span>
                                        </div>
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-gas-pump"></i>
                                            <span class="p-2">${car.fuelType}</span>
                                        </div>
                                    </div>
                                    <div class="row text-center car-info-section mt-2">
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-tachometer-alt car-info-icon"></i>
                                            <span class="p-2">${car.mileage} km/l</span>
                                        </div>
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-cogs"></i>
                                            <span class="p-2">${car.gearType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="container">
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <h6>${car.dailyPrice}.00 / D</h6>
                                        <button class="btn btn-primary rent-btn" data-car-id="${car.carId}" data-car-details='${JSON.stringify(car)}'>Rent now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Append the card HTML to the container
                showCarCard.innerHTML += cardHTML;
            });


            // Attach click event listener to all rent buttons
            document.querySelectorAll('.rent-btn').forEach(button => {
                button.addEventListener('click', function (event) {
                    const carDetails = JSON.parse(event.target.getAttribute('data-car-details'));

                    // Check if the user is logged in by checking session storage
                    if (sessionStorage.getItem('isAuthenticatedUser') === 'true') {
                        // User is authenticated, proceed to open the modal
                        createAndOpenRentCarModal(carDetails);
                    } else {
                        // User is not authenticated, redirect to login page
                        window.location.href = 'signin.html'; // Redirect to login page
                    }
                });
            });
        } else {
            // Optionally, show a message when no cars match the filters
            showCarCard.innerHTML = '<p>No cars found for the applied filters.</p>';
            showCarCard.style.color = "red";
        }
    } catch (error) {
        console.error('Error fetching car details:', error);
    }
}

// Filter form event listener
document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get filter criteria from form inputs
    const filterBrand = document.getElementById('filterBrand').value.trim();
    const filterPrice = document.getElementById('filterModel').value.trim();

    const filterCriteria = {
        brand: filterBrand,
        dayPrice: filterPrice,
    };

    // Fetch and display cars based on the filter criteria
    fetchAndDisplayCars(filterCriteria);
});

// Generate a random ID
function generateId(length) {
    const chars = "1234567890";
    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function createAndOpenRentCarModal(carDetails) {
    // Remove any existing modal
    const existingModal = document.getElementById('dynamicRentCarModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create the modal HTML dynamically
    const modalHTML = `
        <div class="modal fade" id="dynamicRentCarModal" tabindex="-1" aria-labelledby="rentCarModalLabel" aria-hidden="true">
            <div class="modal-dialog" style="max-width: 70%;">
                <div class="modal-content">
                        
                    <div class="modal-header text-center">
                        <h5 class="modal-title" id="rentCarModalLabel">${carDetails.brand} ${carDetails.model} (${carDetails.year})</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <label class="form-label d-none" id="getCarIdForRequest">${carDetails.carId}</label>
                            <div class="col-md-6 d-flex justify-content-center align-items-center">
                                <img id="modalCarImage" src="${carDetails.imagePath}" class="img-fluid" alt="${carDetails.name}">
                            </div>
                            <div class="col-md-6">
                                <div class="container">
                                    <div class="row text-center car-info-section">
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-user car-info-icon"></i>
                                            <span class="p-2">${carDetails.seatCount} People</span>
                                        </div>
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-gas-pump"></i>
                                            <span class="p-2">${carDetails.fuelType}</span>
                                        </div>
                                    </div>
                                    <div class="row text-center car-info-section mt-2">
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-tachometer-alt car-info-icon"></i>
                                            <span class="p-2">${carDetails.mileage} km/l</span>
                                        </div>
                                        <div class="col-6 d-flex justify-content-start align-items-center">
                                            <i class="fas fa-cogs"></i>
                                            <span class="p-2">${carDetails.gearType}</span>
                                        </div>
                                    </div>
                                    <!-- Rental Form -->
                                    <form id="rentCarForm">
                                        <div class="mb-3">
                                            <label for="rentStartDate" class="form-label">Rent Start Date</label>
                                            <input type="date" class="form-control" id="rentStartDate" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="rentEndDate" class="form-label">Return Date</label>
                                            <input type="date" class="form-control" id="rentEndDate" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="rentDuration" class="form-label">Duration (Days)</label>
                                            <input type="number" class="form-control" id="rentDuration" readonly>
                                        </div>
                                        <div class="mb-3">
                                            <label for="totalCost" class="form-label">Total Cost</label>
                                            <input type="text" class="form-control" id="totalCost" readonly>
                                        </div>
                                        <button type="submit" class="btn btn-success">Confirm Rent</button>
                                    </form>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append the modal HTML to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get the current date and format it to set it as the minimum date
    const today = new Date().toISOString().split('T')[0];

    // Set up price and cost calculation
    const startDateInput = document.getElementById('rentStartDate');
    const endDateInput = document.getElementById('rentEndDate');
    const durationInput = document.getElementById('rentDuration');
    const totalCostInput = document.getElementById('totalCost');

    const dayPrice = carDetails.dailyPrice;

    // Set the minimum date for start and end date inputs to today
    startDateInput.setAttribute('min', today);
    endDateInput.setAttribute('min', today);

    function calculateCost() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate && startDate <= endDate) {
            const timeDiff = Math.abs(endDate - startDate);
            const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
            durationInput.value = days;
            totalCostInput.value = (days * dayPrice).toFixed(2); // Calculate total cost
        }
    }

    startDateInput.addEventListener('change', function () {
        endDateInput.setAttribute('min', startDateInput.value); // Ensure end date is after start date
        calculateCost();
    });

    endDateInput.addEventListener('change', calculateCost);

    // Attach event listener to the form submission
    const requestForm = document.getElementById('rentCarForm');
    requestForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userId = sessionStorage.getItem('userId');
        console.log(userId)

        const carId = carDetails.carId;
        const rentStartDate = startDateInput.value;
        const rentEndDate = endDateInput.value;
        const rentDuration = durationInput.value;
        const totalCost = totalCostInput.value;

        const rentId = generateId(16);

        const newRental = {
            rentalId: rentId,
            carId: carId,
            customerId: userId,
            startDate: rentStartDate,
            endDate: rentEndDate,
            duration: rentDuration,
            totalPrice: totalCost,
            action: "pending",
            status: "active",
            requestDate: new Date()
        };
console.log(newRental);
        // Validate that all required fields are filled in properly
        if (!Object.values(newRental).every(value => value !== null && value !== '' && typeof value !== 'undefined')) {
            alert('Please fill out all required fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5034/api/RentalRequest/addRentalRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRental)
            });

            if (response.ok) {
                alert('Request sent successfully!');
                requestForm.reset(); // Fix: Use requestForm instead of carForm
            } else {
                throw new Error('Failed to send Request.');
            }
        } catch (error) {
            alert('Request error. Please try again.');
        }


        // Reset the form
        requestForm.reset();

        // Close the modal
        const rentCarModal = bootstrap.Modal.getInstance(document.getElementById('dynamicRentCarModal'));
        rentCarModal.hide();
    });

    // Show the modal
    const rentCarModal = new bootstrap.Modal(document.getElementById('dynamicRentCarModal'));
    rentCarModal.show();
}

// Call the function to fetch and display cars when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayCars);
console.log(Date())