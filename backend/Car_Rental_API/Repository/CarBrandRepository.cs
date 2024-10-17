using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Microsoft.Data.SqlClient;

namespace Car_Rental_API.Repository
{
    public class CarBrandRepository:ICarBrand

    {
        private readonly string _connectionString;
        public CarBrandRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public ICollection<CarBrand> GetBrands()
        {
            var brands = new List<CarBrand>();
            string query = @"
        SELECT b.BrandId, b.BrandName, 
               m.ModelId, m.ModelName 
        FROM CarBrand b
        LEFT JOIN CarModel m ON b.BrandId = m.BrandId"; // Adjust the table names and join conditions as necessary

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string brandId = reader.GetString(0);
                            string brandName = reader.GetString(1);

                            // Find or create the brand object
                            var brand = brands.FirstOrDefault(b => b.BrandId == brandId);
                            if (brand == null)
                            {
                                brand = new CarBrand
                                {
                                    BrandId = brandId,
                                    BrandName = brandName,
                                    Models = new List<CarModel>() // Initialize the Models list
                                };
                                brands.Add(brand);
                            }

                            // Add the model if it exists
                            if (!reader.IsDBNull(2)) // Check if the model ID is not null
                            {
                                // Create the model object using the constructor
                                var model = new CarModel(
                                    modelId: reader.GetString(2),
                                    modelName: reader.GetString(3),
                                    brandId: brandId // Associate the model with the brand
                                );

                                brand.Models.Add(model); // Add model to the brand's collection
                            }
                        }
                    }
                }
            }

            return brands;
        }

        public CarBrand GetBrandById(string id)
        {
            CarBrand brand = null; // Initialize brand as null
            string query = @"
        SELECT b.BrandId, b.BrandName, 
               m.ModelId, m.ModelName 
        FROM CarBrand b
        LEFT JOIN CarModel m ON b.BrandId = m.BrandId
        WHERE b.BrandId = @BrandId"; // Use parameterized query for security

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    // Set the parameter value for the query
                    cmd.Parameters.AddWithValue("@BrandId", id);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Read data from the reader
                        while (reader.Read())
                        {
                            if (brand == null) // Create the brand object only once
                            {
                                brand = new CarBrand
                                {
                                    BrandId = reader.GetString(0),
                                    BrandName = reader.GetString(1),
                                    Models = new List<CarModel>() // Initialize the Models list
                                };
                            }

                            // Check if the model ID is not null and add to the brand's model list
                            if (!reader.IsDBNull(2))
                            {
                                // Create the model object using the constructor
                                var model = new CarModel(
                                    modelId: reader.GetString(2),
                                    modelName: reader.GetString(3),
                                    brandId: brand.BrandId // Associate the model with the brand
                                );

                                brand.Models.Add(model); // Add model to the brand's collection
                            }
                        }
                    }
                }
            }

            return brand; // Return the found brand (or null if not found)
        }


    }
}
