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
        dailyPrice: dayPrice.value,
        status : "show"

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

