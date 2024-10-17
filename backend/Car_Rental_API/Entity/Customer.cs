using System.ComponentModel.DataAnnotations;

namespace Car_Rental_API.Entity
{
    public class Customer
    {
         public string CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone {  get; set; }
        public string Address { get; set; }
        public string Licence { get; set; }
        public string NIC { get; set; }
        public string Password { get; set; }
       
        
       


        public Customer() { }

        public Customer(string customerId, string firstName, string lastName, string email, string phone, string address, string licence, string nic, string password)
        {
            CustomerId = customerId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
            Address = address;
            Licence = licence;
            NIC = nic;
            Password = password;
        }
    }
}
