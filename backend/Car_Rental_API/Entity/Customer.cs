using System.ComponentModel.DataAnnotations;

namespace Car_Rental_API.Entity
{
    public class Customer
    {
         public int CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImagePath { get; set; }
        public string Phone {  get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string NIC { get; set; }
        public string Licence { get; set; }


        public Customer() { }
        public Customer(int customerId, string firstName, string lastName, string imagePath, string phone, string address, string password, string email, string nIC, string licence)
        {
            CustomerId = customerId;
            FirstName = firstName;
            LastName = lastName;
            ImagePath = imagePath;
            Phone = phone;
            Address = address;
            Password = password;
            Email = email;
            NIC = nIC;
            Licence = licence;
        }
    }
}
