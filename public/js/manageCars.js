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

// Add a new brand dynamically
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

// Generate a random ID
function generateId(length) {
    const chars = "1234567890";
    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Submit car form and add a new car
async function submitCarForm() {
    const imageInput = document.getElementById('logo-id');
    const file = imageInput.files[0];

    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const base64Image = await getBase64(file);

    const carData = {
        id: generateId(24),
        image: base64Image,
        brand: carBrand.value,
        name: carName.value,
        gearType: gearType.value,
        seatCount: seatCount.value,
        fuelType: fuelType.value,
        mileage: mileage.value,
        year: carYear.value,
        regNo: regNo.value,
        dayPrice: dayPrice.value,
    };

    if (!Object.values(carData).every(value => value.trim() !== '' && value !== null)) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/cars', {
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
        const response = await fetch('http://localhost:5000/cars');
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
                    <td>${car.id}</td>
                    <td>${car.regNo}</td>
                    <td style="text-align: center;"><img src="${car.image}" alt="" style="width: 36px; height: 36px; border-radius: 10%; "></td>
                    <td>${car.brand}</td>
                    <td>${car.name}</td>
                    <td>${car.gearType}</td>
                    <td>${car.seatCount}</td>
                    <td>${car.fuelType}</td>
                    <td>${car.mileage}</td>
                    <td>${car.dayPrice}</td>
                    <td>${car.hourPrice}</td>
                    <td>
                        <button class="btn btn-outline-primary edit-btn" data-car-id="${car.id}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button> 
                        <button class="btn btn-outline-danger delete-btn" data-car-id="${car.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>

                    `;

        tableBody.appendChild(row);


    });

    // Add event listeners for Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const carId = event.target.closest('button').getAttribute('data-car-id');
            openCarEditModal(carId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const carId = event.target.closest('button').getAttribute('data-car-id');
            deleteCar(carId);
        });
    });

}

// Fnc to open edit modal for each car id

async function openCarEditModal(carId) {
    try {
        const response = await fetch(`http://localhost:5000/cars/${carId}`);
        if (!response.ok) throw new Error('Car Not Found');
        const car = await response.json();

        console.log(carId);
        
        // Populate modal fields with the car data
        document.getElementById('editCarId').value = car.id;
        document.getElementById('editCarBrand').value = car.brand;
        document.getElementById('editCarName').value = car.name;
        document.getElementById('editCarRegNo').value = car.regNo;
        document.getElementById('editCarYear').value = car.year; 
        document.getElementById('editCarGearType').value = car.gearType;
        document.getElementById('editCarSeatCount').value = car.seatCount;
        document.getElementById('editCarFuelType').value = car.fuelType;
        document.getElementById('editCarMileage').value = car.mileage;
        document.getElementById('editCarDayPrice').value = car.dayPrice;
        document.getElementById('editCarHourPrice').value = car.hourPrice;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editCarModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching car details for editing:', error);
        alert('Failed to load car details.');
    }
}
      
// Save changes to the car
document.getElementById('saveCarChangesBtn').addEventListener('click', async function () {
    const carId = document.getElementById('editCarId').value;
    const updatedCarData = {
        brand: document.getElementById('editCarBrand').value,
        name: document.getElementById('editCarName').value,
        gearType: document.getElementById('editCarGearType').value,
        seatCount: document.getElementById('editCarSeatCount').value,
        fuelType: document.getElementById('editCarFuelType').value,
        regNo: document.getElementById('editCarRegNo').value,
        year: document.getElementById('editCarYear').value,
        mileage: document.getElementById('editCarMileage').value,
        dayPrice: document.getElementById('editCarDayPrice').value,
        hourPrice: document.getElementById('editCarHourPrice').value
    };

    try {
        const response = await fetch(`http://localhost:5000/cars/${carId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCarData)
        });
        if (!response.ok) throw new Error('Failed to save changes');

        // Close the modal after successful update
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCarModal'));
        modal.hide();

        // Refresh the car list to reflect changes
        fetchCars();
        alert('Car details updated successfully!');
    } catch (error) {
        console.error('Error saving car details:', error);
        alert('Failed to save changes.');
    }
});

async function deleteCar(carId) {
    try {
        const response = await fetch(`http://localhost:5000/cars/${carId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete car');
        }

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

