namespace Car_Rental_API.Model
{
    public class CarUpdateRequest
    {
       

        public string Brand { get; set; }
        public string Model { get; set; }
        public string GearType { get; set; }
        public int SeatCount { get; set; }
        public string FuelType { get; set; }
        public int Mileage { get; set; }

        public int Year { get; set; }
        public string RegNo { get; set; }
        public decimal DailyPrice { get; set; }
    }
}
