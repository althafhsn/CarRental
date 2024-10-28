namespace Car_Rental_API.Entity
{
    public class RentalRequest
    {
        public string RentalId { get; set; }
        public string CarId { get; set; }
        public string CustomerId { get; set; }
      
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Duration { get; set; }
        public decimal TotalPrice { get; set; }
        public string Action { get; set; } 
        public string Status { get; set; }
      
        public DateTime RequestDate { get; set; } = DateTime.Now;

        // Navigation properties (optional)
        public Car car { get; set; }

        public RentalRequest(string rentalId,string carId, string customerId, DateTime startDate, DateTime endDate,int duration, decimal totalPrice, string action, string status, DateTime requestDate)
        {
            RentalId = rentalId;
            CarId = carId;
            CustomerId = customerId;
            
            StartDate = startDate;
            EndDate = endDate;
            Duration = duration;
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
