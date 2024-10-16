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
        public async Task<IActionResult>AddCustomer([FromForm]Customer customer)
        {
            Customer cusObj = new Customer(
                customer.CustomerId,
                customer.FirstName,
                customer.LastName,
                customer.ImagePath,
                customer.Phone,
                customer.Address,
                customer.Password,
                customer.Email,
                customer.NIC,
                customer.Licence
                );

            var customerData = customerRepository.AddCustomer(cusObj);
            return Ok(customerData);
        }

        [HttpGet("getAllCustomers")]
        public IActionResult GetCustomer()
        {
            var customerList = customerRepository.GetCustomer();
            return Ok(customerList);
        }

        [HttpGet("GetCustomerById")]

        public IActionResult GetCarById(int id)
        {
            try
            {
                var car = customerRepository.GetCustomerById(id);
                return Ok(car);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateCustomerById/{id}")]
        public IActionResult UpdateCustomer(int id,UpdateCustomerRequest updateCustomerRequest)
        {
            try
            {
                customerRepository.UpdateCustomer(id, updateCustomerRequest);
                return Ok(updateCustomerRequest);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteById/{id}")]
        public IActionResult DeleteCar(int id)
        {
            try
            {
                customerRepository.DeleteCustomer(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
