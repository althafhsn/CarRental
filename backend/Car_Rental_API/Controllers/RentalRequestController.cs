using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Car_Rental_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentalRequestController : ControllerBase
    {
        private readonly IRentalRequestRepository rentalRequestRepository;
        public RentalRequestController(IRentalRequestRepository _rentalRequestRepository)
        {
            rentalRequestRepository = _rentalRequestRepository;
        }

        [HttpPost("addRentalRequest")]
        public async Task<IActionResult> AddRentalRequest(RentalRequest rentalRequest)
        {
            // Create a new RentalRequest object
            RentalRequest rental = new RentalRequest(
                rentalRequest.RentalId,
                rentalRequest.CarId,
                rentalRequest.CustomerId,
                rentalRequest.StartDate,
                rentalRequest.EndDate,
                rentalRequest.Duration,
                rentalRequest.TotalPrice,
                rentalRequest.Action,
                rentalRequest.Status,
                rentalRequest.RequestDate
            );

            // Assuming AddRentalRequest is a synchronous method, we wrap it in Task.Run
            var rentalData = await Task.Run(() => rentalRequestRepository.AddRentalRequest(rental));

            // Return the result using Ok()
            return Ok(rentalData);
        }

        [HttpGet("getAllRentalRequests")]
        public IActionResult GetRentalRequest()
        {
            var rentalList = rentalRequestRepository.GetRentalRequest();
            return Ok(rentalList);
        }


        [HttpGet("getAllRentalRequestsById")]

        public IActionResult GetRentalRequestById(string rentalId)
        {
            try
            {
                var rental = rentalRequestRepository.GetRentalRequestById(rentalId);
                return Ok(rental);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
