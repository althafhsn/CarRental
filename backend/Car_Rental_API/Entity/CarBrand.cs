namespace Car_Rental_API.Entity
{
    public class CarBrand
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public ICollection<CarModel> Models { get; set; } // Assuming this is your list of models

        // Constructor
        public CarBrand(int brandId, string brandName)
        {
            BrandId = brandId;
            BrandName = brandName;
            Models = new List<CarModel>(); // Initialize the list
        }

        // Parameterless constructor (optional, for scenarios where you might not provide parameters)
        public CarBrand()
        {
            Models = new List<CarModel>();
        }
    }

}
