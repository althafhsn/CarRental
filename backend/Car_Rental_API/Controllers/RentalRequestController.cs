﻿using Car_Rental_API.Entity;
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
        //[HttpPut("updateStatusAndAction")]
        //public async Task<IActionResult> UpdateStatusAndAction(string carId, string carStatus, string rentalId, string action)
        //{
        //    try
        //    {
        //        var result = await rentalRequestRepository.UpdateCarAndRentalRequest(carId, carStatus, rentalId, action);

        //        if (result.Success)
        //        {
        //            return Ok(result.Message); // Returns the success message from the UpdateResult
        //        }
        //        else
        //        {
        //            return BadRequest(result.Message); // Returns the error message from the UpdateResult
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}





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
