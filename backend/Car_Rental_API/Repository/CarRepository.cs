using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Model;
using Microsoft.Data.SqlClient;

namespace Car_Rental_API.Repository
{
    public class CarRepository : ICarRepository
    {
        private readonly string _connectionString;

        public CarRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public Car CreateCar(Car car)
        {
            try
            {
                // Removed CarId from the insert query since it's an identity column
                string insertQuery = @"INSERT INTO Cars (CarId,RegNo, Brand, Model, HourlyPrice, DailyPrice, ImagePath, SeatCount, FuelType)
                                       VALUES (@carId,@regNo, @brand, @model, @hourlyprice, @dailyprice, @image, @seatCount, @fuelType);";
                // Use _connectionString passed from the constructor
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        // Bind the parameters
                        command.Parameters.AddWithValue("@carId", car.CarId);
                        command.Parameters.AddWithValue("@regNo", car.RegNo);
                        command.Parameters.AddWithValue("@brand", car.Brand);
                        command.Parameters.AddWithValue("@model", car.Model);
                        command.Parameters.AddWithValue("@hourlyprice", car.HourlyPrice);
                        command.Parameters.AddWithValue("@dailyprice", car.DailyPrice);
                        command.Parameters.AddWithValue("@image", car.ImagePath);
                        command.Parameters.AddWithValue("@seatCount", car.SeatCount);
                        command.Parameters.AddWithValue("@fuelType", car.FuelType);

                        command.ExecuteNonQuery(); // Execute the query
                        Console.WriteLine("Car added successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log more details for debugging purposes
                Console.WriteLine("Error adding car: " + ex.Message);
                throw; // Optionally rethrow the exception if you want it to propagate
            }
            return car;
        }

        public ICollection<Car> GetCars()
        {

            List<Car> cars = new List<Car>();
            string query = @"SELECT * FROM Cars";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand(query, conn);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Car car = new Car(
                               reader.GetInt32(0),
                              reader.GetString(1),
                                reader.GetString(2),
                               reader.GetString(3),
                               reader.GetDecimal(4),
                               reader.GetDecimal(5),
                               reader.GetString(6),
                               reader.GetInt32(7),
                                reader.GetString(8)
                            );
                            cars.Add(car);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }
            return cars;
        }

        public Car GetCarById(int id)
        {
            string getQuery = @"SELECT * FROM Cars WHERE CarId = @id";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand(getQuery, conn);
                    cmd.Parameters.AddWithValue("@Id", id);

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Car(
                                reader.GetInt32(0), 
                                reader.GetString(1), 
                                reader.GetString(2), 
                                reader.GetString(3),
                                reader.GetDecimal(4),
                                reader.GetDecimal(5),
                                reader.GetString(6),
                                reader.GetInt32(7),
                                reader.GetString(8)
                                
                            );
                        }
                        else
                        {
                            return null;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
           
        }

        public CarUpdateRequest UpdateCar(int id,CarUpdateRequest carUpdateRequest)
        {
            try
            {
                var car = GetCarById(id);
                string updateQuery = @"UPDATE Cars SET HourlyPrice=@hourlyprice, DailyPrice=@dailyprice, ImagePath=@image, SeatCount=@seatCount WHERE CarId=@id";
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.Parameters.AddWithValue("@hourlyprice", carUpdateRequest.HourlyPrice);
                        cmd.Parameters.AddWithValue("@dailyprice", carUpdateRequest.DailyPrice);
                        cmd.Parameters.AddWithValue("@image", carUpdateRequest.ImagePath);
                        cmd.Parameters.AddWithValue("@seatCount", carUpdateRequest.SeatCount);
                        cmd.ExecuteNonQuery();
                      
                        Console.WriteLine("Car updated successfully");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return carUpdateRequest;
        }

        public void DeleteCar(int id)
        {
            try
            {
                string deleteQuery = @"DELETE Cars FROM Cars WHERE CarId=@id";
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.ExecuteNonQuery();
                        Console.WriteLine("car deleted successfully");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }


    }
}
