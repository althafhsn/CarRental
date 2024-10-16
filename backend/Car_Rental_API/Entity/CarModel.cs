namespace Car_Rental_API.Entity
{
    public class CarModel
    {
        public string ModelId { get; set; }
        public string ModelName { get; set; }
        public string BrandId { get; set; } // Assuming each model is associated with a brand

        // Constructor
        public CarModel(string modelId, string modelName, string brandId)
        {
            ModelId = modelId;
            ModelName = modelName;
            BrandId = brandId; // Associate the model with a brand
        }
    }

}
