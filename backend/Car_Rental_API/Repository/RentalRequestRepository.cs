

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

        public RentalRequest AddRentalRequest(RentalRequest rentalRequest)
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

        public ICollection<RentalRequest> GetRentalRequest()
        {
            var retalList = new List<RentalRequest>();
            string query = @"SELECT * FROM RentalRequests";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            retalList.Add(new RentalRequest()
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
            return retalList;
        }

        public RentalRequest GetRentalRequestById(string rentalId)
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

        public bool UpdateCarAndRentalRequest(UpdateActionRequest updateAction)
        {
            string updateCarQuery = "UPDATE Cars SET CarStatus = @status WHERE CarId = @carId";
            string updateRentalRequestQuery = "UPDATE RentalRequest SET Action = @action WHERE RentalId = @rentalRequestId AND CarId = @carId";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlTransaction transaction = conn.BeginTransaction())
                {
                    try
                    {
                        // Update the status in the Cars table
                        using (SqlCommand carCommand = new SqlCommand(updateCarQuery, conn, transaction))
                        {
                            carCommand.Parameters.AddWithValue("@status", updateAction.CarStatus);
                            carCommand.Parameters.AddWithValue("@carId", updateAction.CarId);
                            carCommand.ExecuteNonQuery();
                        }

                        // Update the action in the RentalRequest table
                        using (SqlCommand rentalRequestCommand = new SqlCommand(updateRentalRequestQuery, conn, transaction))
                        {
                            rentalRequestCommand.Parameters.AddWithValue("@action", updateAction.Action);
                            rentalRequestCommand.Parameters.AddWithValue("@rentalRequestId", updateAction.RentalId);
                            rentalRequestCommand.Parameters.AddWithValue("@carId", updateAction.CarId);
                            rentalRequestCommand.ExecuteNonQuery();
                        }

                        // Commit transaction if both commands are successful
                        transaction.Commit();
                        return true;
                    }
                    catch
                    {
                        // Rollback transaction if there's an error
                        transaction.Rollback();
                        throw; // Rethrow the error to handle it outside this method
                    }
                }
            }


            //public bool UpdateRentalRequestAction(UpdateActionRequest updateAction)
            //{
            //    string updateQuery = @"UPDATE RentalRequests SET Action = @action, CarStatus = @status WHERE RentalId = @rentalId";

            //    using (SqlConnection conn = new SqlConnection(_connectionString))
            //    {
            //        conn.Open();
            //        using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
            //        {
            //            cmd.Parameters.AddWithValue("@carId", updateAction.CarId);  
            //            cmd.Parameters.AddWithValue("@rentalId", updateAction.RentalId);
            //            cmd.Parameters.AddWithValue("@action", updateAction.Action);
            //            cmd.Parameters.AddWithValue("@status", updateAction.CarStatus);

            //            int rowsAffected = cmd.ExecuteNonQuery();
            //            return rowsAffected > 0;  // Return true if update is successful
            //        }
            //    }
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
