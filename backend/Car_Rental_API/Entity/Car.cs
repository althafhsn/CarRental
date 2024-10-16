public class Car
{
    public int CarId { get; set; }
    public string RegNo { get; set; }
    public string Brand { get; set; }
    public string Model { get; set; }
    public decimal HourlyPrice { get; set; }
    public decimal DailyPrice { get; set; }
    public string ImagePath { get; set; }
    public int SeatCount { get; set; }
    public string FuelType { get; set; }

    // Parameterless constructor required for model binding
    public Car()
    {
    }

    // Constructor with parameters
    public Car(int carId, string regNo, string brand, string model, decimal hourlyPrice, decimal dailyPrice, string imagePath, int seatCount, string fuelType)
    {
        CarId = carId;
        RegNo = regNo;
        Brand = brand;
        Model = model;
        HourlyPrice = hourlyPrice;
        DailyPrice = dailyPrice;
        ImagePath = imagePath;
        SeatCount = seatCount;
        FuelType = fuelType;
    }
}
