
using Car_Rental_API.Entity;
using Car_Rental_API.Model;

namespace Car_Rental_API.IRepository
{
    public interface ICustomerRepository
    {
        Task<Customer> AddCustomer(Customer customer);
        Task<ICollection<Customer>> GetCustomer();
        Task<Customer> GetCustomerById(string customerId);
        Task<UpdateCustomerRequest> UpdateCustomer(string customerId, UpdateCustomerRequest updateCustomerRequest);
        void DeleteCustomer(string customerId);
    }
}
