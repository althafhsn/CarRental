namespace Car_Rental_API.Entity
{
    public class RentalRequest
    {
        public int RentalId { get; set; }
        public int CustomerId { get; set; }
        public int CarId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Action { get; set; } = "Pending";
        public string Status { get; set; }
      
        public DateTime RequestDate { get; set; } = DateTime.Now;

        // Navigation properties (optional)
        //public Customer customer { get; set; }
        //public Car car { get; set; }

        public RentalRequest(int rentalId, int customerId, int carId, DateTime startDate, DateTime endDate, decimal totalPrice, string action, string status, DateTime requestDate)
        {
            RentalId = rentalId;
            CustomerId = customerId;
            CarId = carId;
            StartDate = startDate;
            EndDate = endDate;
            TotalPrice = totalPrice;
            Action = action;
            Status = status;
            RequestDate = requestDate;
        }

        public RentalRequest()
        {
        }
    }
}
