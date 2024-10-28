
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

        public async Task<Car> CreateCar(Car car)
        {
            try
            {
                // Removed CarId from the insert query since it's an identity column
                string insertQuery = @"INSERT INTO Cars (CarId,ImagePath,Brand,Model,GearType,SeatCount,FuelType,Mileage,Year,RegNo,DailyPrice,CarStatus)
                                       VALUES (@carId,@imagePath,@brand,@model,@gearType,@seatCount,@fuelType,@mileage,@year,@regNo,@dailyPrice,@status);";
                // Use _connectionString passed from the constructor
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        // Bind the parameters
                        command.Parameters.AddWithValue("@carId", car.CarId);
                        command.Parameters.AddWithValue("@imagePath", car.ImagePath);
                        command.Parameters.AddWithValue("@brand", car.Brand);
                        command.Parameters.AddWithValue("@model", car.Model);
                        command.Parameters.AddWithValue("@gearType", car.GearType);
                        command.Parameters.AddWithValue("@seatCount", car.SeatCount);
                        command.Parameters.AddWithValue("@fuelType", car.FuelType);
                        command.Parameters.AddWithValue("@mileage", car.Mileage);
                        command.Parameters.AddWithValue("@year", car.Year);
                        command.Parameters.AddWithValue("@regNo", car.RegNo);
                        command.Parameters.AddWithValue("@dailyPrice", car.DailyPrice);
                        command.Parameters.AddWithValue("@status", car.CarStatus);

                        await command.ExecuteNonQueryAsync(); // Execute the query
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

        public async Task<ICollection<Car>> GetCars()
        {

            List<Car> cars = new List<Car>();
            string query = @"SELECT * FROM Cars";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand(query, conn);
                    await conn.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Car car = new Car(
                                reader.GetString(0),
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetString(4),
                                reader.GetInt32(5),
                                reader.GetString(6),
                                reader.GetInt32(7),
                                reader.GetInt32(8),
                                reader.GetString(9),
                                reader.GetDecimal(10),
                                reader.GetString(11)


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

        public async Task<Car> GetCarById(string carId)
        {
            string getQuery = @"SELECT * FROM Cars WHERE CarId = @carId";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(getQuery, conn))
                    {
                        await conn.OpenAsync();
                        cmd.Parameters.AddWithValue("@carId", carId);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new Car(
                                    reader.GetString(0),
                                    reader.GetString(1),
                                    reader.GetString(2),
                                    reader.GetString(3),
                                    reader.GetString(4),
                                    reader.GetInt32(5),
                                    reader.GetString(6),
                                    reader.GetInt32(7),
                                    reader.GetInt32(8),
                                    reader.GetString(9),
                                    reader.GetDecimal(10),
                                    reader.GetString(11)

                                );
                            }
                            else
                            {
                                throw new Exception("Car id not found");
                            }
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
        public async Task<CarUpdateRequest> UpdateCar(string carId, CarUpdateRequest carUpdateRequest)
        {

            var car = GetCarById(carId);
            string updateQuery = @"UPDATE Cars SET Brand=@brand,Model=@model,GearType=@gearType,SeatCount=@seatCount,FuelType=@fuelType,Mileage=@mileage,Year=@year,RegNo=@regNo, DailyPrice=@dailyPrice WHERE CarId=@carId";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand command = new SqlCommand(updateQuery, conn))
                {
                    command.Parameters.AddWithValue("@carId", carId);
                    command.Parameters.AddWithValue("@brand", carUpdateRequest.Brand);
                    command.Parameters.AddWithValue("@model", carUpdateRequest.Model);
                    command.Parameters.AddWithValue("@gearType", carUpdateRequest.GearType);
                    command.Parameters.AddWithValue("@seatCount", carUpdateRequest.SeatCount);
                    command.Parameters.AddWithValue("@fuelType", carUpdateRequest.FuelType);
                    command.Parameters.AddWithValue("@mileage", carUpdateRequest.Mileage);
                    command.Parameters.AddWithValue("@year", carUpdateRequest.Year);
                    command.Parameters.AddWithValue("@regNo", carUpdateRequest.RegNo);
                    command.Parameters.AddWithValue("@dailyPrice", carUpdateRequest.DailyPrice);

                    await command.ExecuteNonQueryAsync();

                }
            }

            return carUpdateRequest;
        }

        public async void DeleteCar(string carId)
        {
            string deleteQuery = @"DELETE FROM Cars WHERE CarId=@carId";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@carId", carId);
                    int rowsAffected = cmd.ExecuteNonQuery();  // Capture affected rows

                    if (rowsAffected > 0)
                    {
                        Console.WriteLine("Car deleted successfully");
                    }
                    else
                    {
                        Console.WriteLine("No car found with the specified ID");
                    }
                }
            }

        }
        public async Task<UpdateCarStatusRequest> UpdateCarStatus(string carId, UpdateCarStatusRequest updateCarStatus)
        {

            var car = GetCarById(carId);
            string updateQuery = @"UPDATE Cars SET CarStatus=@carstatus WHERE CarId=@carId";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand command = new SqlCommand(updateQuery, conn))
                {
                    command.Parameters.AddWithValue("@carId", carId);
                    command.Parameters.AddWithValue("@carStatus", updateCarStatus.CarStatus);

                    await command.ExecuteNonQueryAsync();

                }
            }

            return  updateCarStatus;
        }



    }
}
