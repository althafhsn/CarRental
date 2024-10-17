using Car_Rental_API.IRepository;
using Car_Rental_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Car_Rental_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarBrandController : ControllerBase
    {
        private readonly ICarBrand carBrand;
        public CarBrandController(ICarBrand _carBrand)
        {
            carBrand = _carBrand;
        }

        [HttpGet("getAllBrand")]
        public IActionResult GetBrands()
        {
            var brandList = carBrand.GetBrands();
            return Ok(brandList);
        }

        [HttpGet("getAllBrandById")]

        public IActionResult GetBrandById(string id)
        {
            try
            {
                var brand = carBrand.GetBrandById(id);
                return Ok(brand);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
