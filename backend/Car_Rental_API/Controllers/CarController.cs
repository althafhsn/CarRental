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
        public async Task<IActionResult> CreateCar([FromForm] Car car)
        {
            Car carObj = new Car(
                car.CarId,
            car.RegNo,
            car.Brand,
             car.Model,
         car.HourlyPrice,
         car.DailyPrice,
         car.ImagePath,
         car.SeatCount,
         car.FuelType
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

        public IActionResult GetCarById(int carId)
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

        [HttpPut("UpdateCarById/{id}")]
        public IActionResult UpdateCar( int id, CarUpdateRequest carUpdateRequest)
        {
            try
            {
                _carRepository.UpdateCar(id, carUpdateRequest);
                return Ok(carUpdateRequest);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteById/{carId}")]
        public IActionResult DeleteCar(int carId)
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
