using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Model;
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

        [HttpPut("updateAction")]
        public IActionResult UpdateRentalRequestAction([FromBody] UpdateActionRequest updateAction)
        {
            if (updateAction == null || string.IsNullOrEmpty(updateAction.RentalId) || string.IsNullOrEmpty(updateAction.Action) || string.IsNullOrEmpty(updateAction.Status))
            {
                return BadRequest("Invalid request data");
            }

            try
            {
                var isUpdated = rentalRequestRepository.UpdateRentalRequestAction(updateAction);
                if (isUpdated)
                {
                    return Ok(new { message = "Rental request action updated successfully" });
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

        //[HttpGet("get-Status")]
        //public IActionResult GetRentalRequestStatus(string rentalId)
        //{
        //    var status = rentalRequestRepository.GetRentalRequestStatus(rentalId);
        //    return Ok(status);
        //}

        //[HttpPut("updateStatus")]
        //public IActionResult UpdateRentalRequestStatus([FromBody] UpdateStatusRequestcs updateRequest)
        //{
        //    if (updateRequest == null || string.IsNullOrEmpty(updateRequest.RentalId) || string.IsNullOrEmpty(updateRequest.Status))
        //    {
        //        return BadRequest("Invalid request data");
        //    }

        //    try
        //    {
        //        var isUpdated = rentalRequestRepository.UpdateRentalRequestStatus(updateRequest.RentalId, updateRequest.Status);
        //        if (isUpdated)
        //        {
        //            return Ok(new { message = "Rental request status updated successfully" });
        //        }
        //        else
        //        {
        //            return NotFound("Rental request not found");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}
    }
}
