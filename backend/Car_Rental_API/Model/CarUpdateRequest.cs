namespace Car_Rental_API.Model
{
    public class CarUpdateRequest
    {
        public decimal HourlyPrice { get; set; }
        public decimal DailyPrice { get; set; }
        public string ImagePath { get; set; }
        public int SeatCount { get; set; }
    }
}
