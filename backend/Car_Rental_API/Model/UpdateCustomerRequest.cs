namespace Car_Rental_API.Model
{
    public class UpdateCustomerRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string NIC { get; set; }
        public string Licence { get; set; }
    }
}
