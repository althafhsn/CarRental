using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Model;
using Microsoft.Data.SqlClient;

namespace Car_Rental_API.Repository
{
    public class RentalRequestRepository : IRentalRequestRepository

    {
        private readonly string _connectionString;
        public RentalRequestRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<RentalRequest> AddRentalRequest(RentalRequest rentalRequest)
        {
            try
            {
                string insertQuery = @"INSERT INTO RentalRequests (RentalId,CarId, CustomerId, StartDate, EndDate,Duration, TotalPrice, Action, Status, RequestDate)
                                       VALUES (@rentalId,@carId, @customerId, @startDate, @endDate,@duration,@totalPrice,@action, @status, @requestDate);";
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@rentalId", rentalRequest.RentalId);
                        command.Parameters.AddWithValue("@carId", rentalRequest.CarId);
                        command.Parameters.AddWithValue("@customerId", rentalRequest.CustomerId);
                        command.Parameters.AddWithValue("@startDate", rentalRequest.StartDate);
                        command.Parameters.AddWithValue("@endDate", rentalRequest.EndDate);
                        command.Parameters.AddWithValue("@duration", rentalRequest.Duration);
                        command.Parameters.AddWithValue("@totalPrice", rentalRequest.TotalPrice);
                        command.Parameters.AddWithValue("@action", rentalRequest.Action);
                        command.Parameters.AddWithValue("@status", rentalRequest.Status);
                        command.Parameters.AddWithValue("@requestDate", rentalRequest.RequestDate);

                        command.ExecuteNonQuery();
                        Console.WriteLine("Rental request added successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error adding rental request: " + ex.Message);
                throw;
            }
            return rentalRequest;
        }

        public async Task<ICollection<RentalRequest>> GetRentalRequestAsync()
        {
            var rentalList = new List<RentalRequest>();
            string query = @"SELECT * FROM RentalRequests";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync(); // Open connection asynchronously
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync()) // Execute reader asynchronously
                    {
                        while (await reader.ReadAsync()) // Read asynchronously
                        {
                            rentalList.Add(new RentalRequest()
                            {
                                RentalId = reader.GetString(0),
                                CarId = reader.GetString(1),
                                CustomerId = reader.GetString(2),
                                StartDate = reader.GetDateTime(3),
                                EndDate = reader.GetDateTime(4),
                                Duration = reader.GetInt32(5),
                                TotalPrice = reader.GetDecimal(6),
                                Action = reader.GetString(7),
                                Status = reader.GetString(8),
                                RequestDate = reader.GetDateTime(9)
                            });
                        }
                    }
                }
            }
            return rentalList; // No need for 'await' here since returning a non-task
        }


        public async Task<RentalRequest> GetRentalRequestById(string rentalId)
        {
            string getQuery = @"SELECT * FROM RentalRequests WHERE RentalId = @rentalId";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(getQuery, conn))
                {

                    cmd.Parameters.AddWithValue("@rentalId", rentalId);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new RentalRequest()
                            {
                                RentalId = reader.GetString(0),
                                CarId = reader.GetString(1),
                                CustomerId = reader.GetString(2),
                                StartDate = reader.GetDateTime(3),
                                EndDate = reader.GetDateTime(4),
                                Duration = reader.GetInt32(5),
                                TotalPrice = reader.GetDecimal(6),
                                Action = reader.GetString(7),
                                Status = reader.GetString(8),
                                RequestDate = reader.GetDateTime(9)
                            };

                        }
                        else
                        {
                            throw new Exception("Customer Not Found!");
                        }
                    }
                }

            }

            return null;

        }

        public async Task<bool> UpdateRentalRequestAction(UpdateActionRequest updateAction)
        {
            string updateQuery = @"UPDATE RentalRequests SET Action = @action, Status = @status WHERE RentalId = @rentalId";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@rentalId", updateAction.RentalId);
                    cmd.Parameters.AddWithValue("@action", updateAction.Action);
                    cmd.Parameters.AddWithValue("@status", updateAction.Status);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;  // Return true if update is successful
                }
            }
        }

        //public class UpdateResult
        //{
        //    public bool Success { get; set; }
        //    public string Message { get; set; }
        //    public string CarId { get; set; }
        //    public string RentalId { get; set; }
        //}

        //public async Task<UpdateResult> UpdateCarAndRentalRequest(string carId, string carStatus, string rentalId, string action)
        //{
        //    // Validate inputs
        //    if (string.IsNullOrWhiteSpace(carId))
        //        throw new ArgumentException("Car ID cannot be null or empty.", nameof(carId));
        //    if (string.IsNullOrWhiteSpace(carStatus))
        //        throw new ArgumentException("Car status cannot be null or empty.", nameof(carStatus));
        //    if (string.IsNullOrWhiteSpace(rentalId))
        //        throw new ArgumentException("Rental ID cannot be null or empty.", nameof(rentalId));
        //    if (string.IsNullOrWhiteSpace(action))
        //        throw new ArgumentException("Action cannot be null or empty.", nameof(action));

        //    // Define SQL queries
        //    string updateCarQuery = "UPDATE Cars SET CarStatus = @carStatus WHERE CarId = @carId";
        //    string updateRentalRequestQuery = "UPDATE RentalRequests SET Action = @action WHERE RentalId = @rentalId AND CarId = @carId";

        //    using (SqlConnection conn = new SqlConnection(_connectionString))
        //    {
        //        await conn.OpenAsync();

        //        // Update the status in the Cars table
        //        using (SqlCommand carCommand = new SqlCommand(updateCarQuery, conn))
        //        {
        //            carCommand.Parameters.AddWithValue("@carStatus", carStatus);
        //            carCommand.Parameters.AddWithValue("@carId", carId);

        //            int carUpdateResult = await carCommand.ExecuteNonQueryAsync();
        //            if (carUpdateResult == 0)
        //                return new UpdateResult
        //                {
        //                    Success = false,
        //                    Message = "Failed to update the car status. Car ID may be incorrect.",
        //                    CarId = carId,
        //                    RentalId = rentalId
        //                };
        //        }

        //        // Update the action in the RentalRequests table
        //        using (SqlCommand rentalRequestCommand = new SqlCommand(updateRentalRequestQuery, conn))
        //        {
        //            rentalRequestCommand.Parameters.AddWithValue("@action", action);
        //            rentalRequestCommand.Parameters.AddWithValue("@rentalId", rentalId);
        //            rentalRequestCommand.Parameters.AddWithValue("@carId", carId);

        //            int rentalUpdateResult = await rentalRequestCommand.ExecuteNonQueryAsync();
        //            if (rentalUpdateResult == 0)
        //                return new UpdateResult
        //                {
        //                    Success = false,
        //                    Message = "Failed to update the rental request. Rental ID or Car ID may be incorrect.",
        //                    CarId = carId,
        //                    RentalId = rentalId
        //                };
        //        }
        //    }

        //    return new UpdateResult
        //    {
        //        Success = true,
        //        Message = "Car status and rental request updated successfully.",
        //        CarId = carId,
        //        RentalId = rentalId
        //    };
        //}


        //public async Task<bool> UpdateCarAndRentalRequest(string carId, string carStatus, string rentalId, string action)
        //{
        //    // Validate inputs
        //    if (string.IsNullOrWhiteSpace(carId))
        //        throw new ArgumentException("Car ID cannot be null or empty.", nameof(carId));
        //    if (string.IsNullOrWhiteSpace(carStatus))
        //        throw new ArgumentException("Car status cannot be null or empty.", nameof(carStatus));
        //    if (string.IsNullOrWhiteSpace(rentalId))
        //        throw new ArgumentException("Rental ID cannot be null or empty.", nameof(rentalId));
        //    if (string.IsNullOrWhiteSpace(action))
        //        throw new ArgumentException("Action cannot be null or empty.", nameof(action));

        //    // Define SQL queries
        //    string updateCarQuery = "UPDATE Cars SET CarStatus = @carStatus WHERE CarId = @carId";
        //    string updateRentalRequestQuery = "UPDATE RentalRequests SET Action = @action WHERE RentalId = @rentalId AND CarId = @carId";

        //    using (SqlConnection conn = new SqlConnection(_connectionString))
        //    {
        //        await conn.OpenAsync();

        //        // Update the status in the Cars table
        //        using (SqlCommand carCommand = new SqlCommand(updateCarQuery, conn))
        //        {
        //            carCommand.Parameters.AddWithValue("@carStatus", carStatus);
        //            carCommand.Parameters.AddWithValue("@carId", carId);

        //            int carUpdateResult = await carCommand.ExecuteNonQueryAsync();
        //            if (carUpdateResult == 0)
        //                throw new InvalidOperationException("Failed to update the car status. Car ID may be incorrect.");
        //        }

        //        // Update the action in the RentalRequests table
        //        using (SqlCommand rentalRequestCommand = new SqlCommand(updateRentalRequestQuery, conn))
        //        {
        //            rentalRequestCommand.Parameters.AddWithValue("@action", action);
        //            rentalRequestCommand.Parameters.AddWithValue("@rentalId", rentalId);
        //            rentalRequestCommand.Parameters.AddWithValue("@carId", carId);

        //            int rentalUpdateResult = await rentalRequestCommand.ExecuteNonQueryAsync();
        //            if (rentalUpdateResult == 0)
        //                throw new InvalidOperationException("Failed to update the rental request. Rental ID or Car ID may be incorrect.");
        //        }
        //    }

        //    return true;
        //}





        //public ICollection<GetStatusRequest> GetRentalRequestStatus(string rentalId)
        //{
        //    var status = new List<GetStatusRequest>();
        //    string query = @"SELECT Status CarId FROM RentalRequests WHERE RentalId = @rentalId";
        //    using (SqlConnection conn = new SqlConnection(_connectionString))
        //    {
        //        conn.Open();
        //        using (SqlCommand cmd = new SqlCommand(query, conn))
        //        {
        //            cmd.Parameters.AddWithValue("@rentalId",rentalId);
        //            //    cmd.Parameters.AddWithValue(@"carId", getStatus.CarId);
        //            using (SqlDataReader reader = cmd.ExecuteReader())
        //            {
        //                while (reader.Read())
        //                {

        //                    status.Add(new GetStatusRequest()
        //                    {
        //                        RentalId = reader.GetString(0),
        //                        CarId = reader.GetString(1),
        //                        Status = reader.GetString(2)
        //                    });

        //                }


        //            }
        //        }
        //    }
        //    return status;
        //}

        //public bool UpdateRentalRequestStatus(string rentalId, string status)
        //{
        //    string updateQuery = @"UPDATE RentalRequests SET Status = @status WHERE RentalId = @rentalId";

        //    using (SqlConnection conn = new SqlConnection(_connectionString))
        //    {
        //        conn.Open();
        //        using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
        //        {
        //            cmd.Parameters.AddWithValue("@status", status);
        //            cmd.Parameters.AddWithValue("@rentalId", rentalId);

        //            int rowsAffected = cmd.ExecuteNonQuery();
        //            return rowsAffected > 0;  // Return true if update is successful
        //        }
        //    }
        //}
    }
}
