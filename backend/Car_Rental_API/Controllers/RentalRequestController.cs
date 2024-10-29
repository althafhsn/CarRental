using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Model;
using Car_Rental_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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

            var rentalData = await Task.Run(() => rentalRequestRepository.AddRentalRequest(rental));

            return Ok(rentalData);
        }

        [HttpGet("getAllRentalRequests")]
        public async Task<IActionResult> GetRentalRequest()
        {
            var rentalList = await rentalRequestRepository.GetRentalRequest();
            return Ok(rentalList);
        }


        [HttpGet("getAllRentalRequestsById")]

        public async Task<IActionResult> GetRentalRequestById(string rentalId)
        {
            try
            {
                var rental = await rentalRequestRepository.GetRentalRequestById(rentalId);
                return Ok(rental);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateAction")]
        public async Task<IActionResult> UpdateRentalRequestAction( UpdateActionRequest updateAction)
        {
            if (updateAction == null || string.IsNullOrEmpty(updateAction.RentalId) || string.IsNullOrEmpty(updateAction.Action))
            {
                return BadRequest("Invalid request data");
            }

            try
            {
                var isUpdated = await rentalRequestRepository.UpdateRentalRequestAction(updateAction);
                if (isUpdated)
                {
                    return Ok(isUpdated);
                }
                else
                {
                    return NotFound("Rental request not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateRentalReturn(UpdatgeReturnRequest updateReturn)
        {
            if (updateReturn == null || string.IsNullOrEmpty(updateReturn.RentalId) || string.IsNullOrEmpty(updateReturn.Status))
            {
                return BadRequest("Invalid request data");
            }

            try
            {
                var isUpdated = await rentalRequestRepository.UpdateRentalReturn(updateReturn);
                if (isUpdated)
                {
                    return Ok(isUpdated);
                }
                else
                {
                    return NotFound("Rental request not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
