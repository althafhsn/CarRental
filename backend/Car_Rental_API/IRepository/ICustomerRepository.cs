
using Car_Rental_API.Entity;
using Car_Rental_API.Model;

namespace Car_Rental_API.IRepository
{
    public interface ICustomerRepository
    {
        Customer AddCustomer(Customer customer);
        ICollection<Customer> GetCustomer();
        Customer GetCustomerById(string customerId);
        UpdateCustomerRequest UpdateCustomer(string customerId, UpdateCustomerRequest updateCustomerRequest);
        void DeleteCustomer(string customerId);
    }
}
