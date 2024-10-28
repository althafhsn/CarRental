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
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository customerRepository;

        public CustomerController(ICustomerRepository _customerRepository)
        {
            customerRepository = _customerRepository;
        }

        [HttpPost("addCustomer")]
        public async Task<IActionResult>AddCustomer(Customer customer)
        {
            Customer cusObj = new Customer(
                customer.CustomerId,
                customer.FirstName,
                customer.LastName,
                customer.Email,
                customer.Phone,
                customer.Address,
                customer.Licence,
                customer.NIC,
                customer.Password
                );

            var customerData = await customerRepository.AddCustomer(cusObj);
            return Ok(customerData);
        }

        [HttpGet("getAllCustomers")]
        public async Task<IActionResult> GetCustomer()
        {
            var customerList =await customerRepository.GetCustomer();
            return Ok(customerList);
        }

        [HttpGet("GetCustomerById")]

        public async Task<IActionResult> GetCarById(string customerId)
        {
            try
            {
                var car =await customerRepository.GetCustomerById(customerId);
                return Ok(car);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateCustomerById")]
        public async Task<IActionResult> UpdateCustomer(string customerId, UpdateCustomerRequest updateCustomerRequest)
        {
            try
            {
               await customerRepository.UpdateCustomer(customerId, updateCustomerRequest);
                return Ok(updateCustomerRequest);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteById")]
        public async Task<IActionResult> DeleteCar(string customerId)
        {
            try
            {
                customerRepository.DeleteCustomer(customerId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
