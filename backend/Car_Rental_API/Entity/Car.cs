public class Car
{
    public string CarId { get; set; }
    public string ImagePath { get; set; }
   
    public string Brand { get; set; }
    public string Model { get; set; }
    public string GearType { get; set; }
    public int SeatCount { get; set; }
    public string FuelType { get; set; }
    public int Mileage { get; set; }
   
    public int Year { get; set; }
   public string RegNo { get; set; }
    public decimal DailyPrice { get; set; }
    public string Status    { get; set; }

    // Parameterless constructor required for model binding
    public Car()
    {
    }

    public Car(string carId, string imagePath, string brand, string model, string gearType, int seatCount, string fuelType, int mileage, int year, string regNo,decimal dailyPrice, string status)
    {
        CarId = carId;
        ImagePath = imagePath;
        Brand = brand;
        Model = model;
        GearType = gearType;
        SeatCount = seatCount;
        FuelType = fuelType;
        Mileage = mileage;
        Year = year;
        RegNo = regNo;
        DailyPrice = dailyPrice;
        Status = status;
    }

    // Constructor with parameters

}
