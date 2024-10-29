using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Model;
using Car_Rental_API.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Car_Rental_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly ICarRepository _carRepository;

        public CarController(ICarRepository carRepository)
        {
            _carRepository = carRepository;
        }

        [HttpPost("Add-car")]
        public async Task<IActionResult> CreateCar(Car car)
        {
            Car carObj = new Car(
                car.CarId,
                car.ImagePath,
                car.Brand,
                car.Model,
                car.GearType,
                car.SeatCount,
                car.FuelType,
                car.Mileage,
                car.Year,
                car.RegNo,
                car.DailyPrice,
                car.CarStatus
     );

           var carData = await _carRepository.CreateCar(carObj);
            return Ok(carData);
        }

        [HttpGet("getAllCars")]
        public async Task<IActionResult> GetCars()
        {
            var carList =await _carRepository.GetCars();
            return Ok(carList);
        }

        [HttpGet("GetCarById")]

        public async Task<IActionResult> GetCarById(string carId)
        {
            try
            {
                var car = await _carRepository.GetCarByIdASync(carId);
                return Ok(car);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateCarById")]
        public async Task<IActionResult> UpdateCar( string carId, CarUpdateRequest carUpdateRequest)
        {
            try
            {
               await _carRepository.UpdateCar(carId, carUpdateRequest);
                return Ok(carUpdateRequest);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteById")]
        public async Task<IActionResult> DeleteCar(string carId)
        {
            try
            {
                _carRepository.DeleteCar(carId);
                return Ok();
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("UpdateStatusCarById")]
        public async Task<IActionResult> UpdateCarStatus(string carId, UpdateCarStatusRequest updateCarStatus)
        {
            try
            {
                var result = await _carRepository.UpdateCarStatusAsync(carId, updateCarStatus);

                // Wrap the result in a response object with appropriate naming
                return Ok(new { Message = "Car status updated successfully", Status = result.CarStatus });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
