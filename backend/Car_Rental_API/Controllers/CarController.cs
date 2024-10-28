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

           var carData = _carRepository.CreateCar(carObj);
            return Ok(carData);
        }

        [HttpGet("getAllCars")]
        public IActionResult GetCars()
        {
            var carList = _carRepository.GetCars();
            return Ok(carList);
        }

        [HttpGet("GetCarById")]

        public IActionResult GetCarById(string carId)
        {
            try
            {
                var car = _carRepository.GetCarById(carId);
                return Ok(car);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateCarById")]
        public IActionResult UpdateCar( string carId, CarUpdateRequest carUpdateRequest)
        {
            try
            {
                _carRepository.UpdateCar(carId, carUpdateRequest);
                return Ok(carUpdateRequest);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteById")]
        public IActionResult DeleteCar(string carId)
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
    }
}
