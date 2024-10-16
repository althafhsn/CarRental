using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Microsoft.Data.SqlClient;

namespace Car_Rental_API.Repository
{
    public class RentalRequestRepository:IRentalRequestRepository

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
                string insertQuery = @"INSERT INTO RentalRequests (RentalId,CustomerID, CarID, StartDate, EndDate, TotalPrice, Action, Status, RequestDate)
                                       VALUES (@rentalId,@customerId, @carId, @startDate, @endDate,@totalPrice,@action, @status, @requestDate);";
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@rentalId", rentalRequest.RentalId);
                        command.Parameters.AddWithValue("@customerId", rentalRequest.CustomerId);
                        command.Parameters.AddWithValue("@carId", rentalRequest.CarId);
                        command.Parameters.AddWithValue("@startDate", rentalRequest.StartDate);
                        command.Parameters.AddWithValue("@endDate", rentalRequest.EndDate);
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
                               RentalId = reader.GetInt32(0),
                               CustomerId = reader.GetInt32(1),
                               CarId = reader.GetInt32(2),
                               StartDate = reader.GetDateTime(3),
                               EndDate = reader.GetDateTime(4),
                               TotalPrice = reader.GetDecimal(5),
                               Action = reader.GetString(6),
                               Status = reader.GetString(7),
                               RequestDate = reader.GetDateTime(8)
                            });

                        }


                    }
                }
            }
            return retalList;
        }

        public RentalRequest GetRentalRequestById(int id)
        {
            string getQuery = @"SELECT * FROM RentalRequests WHERE RentalId = @id";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(getQuery, conn))
                {

                    cmd.Parameters.AddWithValue("@id", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new RentalRequest()
                            {
                                RentalId = reader.GetInt32(0),
                                CustomerId = reader.GetInt32(1),
                                CarId = reader.GetInt32(2),
                                StartDate = reader.GetDateTime(3),
                                EndDate = reader.GetDateTime(4),
                                TotalPrice = reader.GetDecimal(5),
                                Action = reader.GetString(6),
                                Status = reader.GetString(7),
                                RequestDate = reader.GetDateTime(8)
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
    }
}
