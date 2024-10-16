using Car_Rental_API.Entity;
using Car_Rental_API.IRepository;
using Car_Rental_API.Model;
using Microsoft.Data.SqlClient;
using System.ComponentModel;
using System.Net;
using System.Numerics;

namespace Car_Rental_API.Repository
{
    public class CustomerRepository:ICustomerRepository
    {
        private readonly string _connectionString;

        public CustomerRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public Customer AddCustomer(Customer customer)
        {
            try
            {
                // Removed CarId from the insert query since it's an identity column
                string insertQuery = @"INSERT INTO Customers (CustomerId,FirstName,LastName,ImagePath,Phone,Address,Password,Email,NIC,Licence)
                                       VALUES (@customerId,@firstName,@lastName,@imagePath,@phone,@address,@password,@email,@nIC,@licence);";
                // Use _connectionString passed from the constructor
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        // Bind the parameters
                        command.Parameters.AddWithValue("@customerId",customer.CustomerId);
                        command.Parameters.AddWithValue("@firstName",customer.FirstName);
                        command.Parameters.AddWithValue("@lastName",customer.LastName);
                        command.Parameters.AddWithValue("@imagePath",customer.ImagePath);
                        command.Parameters.AddWithValue("@phone",customer.Phone);
                        command.Parameters.AddWithValue("@address",customer.Address);
                        command.Parameters.AddWithValue("@password",customer.Password);
                        command.Parameters.AddWithValue("@email",customer.Email);
                        command.Parameters.AddWithValue("@nIC",customer.NIC);
                        command.Parameters.AddWithValue("@licence", customer.Licence);


                        command.ExecuteNonQuery(); // Execute the query
                        Console.WriteLine("Customer added successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log more details for debugging purposes
                Console.WriteLine("Error adding customer: " + ex.Message);
                throw; // Optionally rethrow the exception if you want it to propagate
            }
            return customer;
        }

        public ICollection<Customer> GetCustomer()
        {
            var customers = new List<Customer>();
            string query = @"SELECT * FROM Customers";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            customers.Add(new Customer()
                            {
                                CustomerId = int.Parse(reader.GetString(0)),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                ImagePath = reader.GetString(3),
                                Phone = reader.GetString(4),
                                Address = reader.GetString(5),
                                Password = reader.GetString(6),
                                Email = reader.GetString(7),
                                NIC = reader.GetString(8),
                                Licence = reader.GetString(9)
                            });

                        }


                    }
                }
            }
            return customers;
        }

        public Customer GetCustomerById(int id)
        {
            string getQuery = @"SELECT * FROM Customers WHERE CustomerId = @id";

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
                            return new Customer()
                            {
                                CustomerId = int.Parse(reader.GetString(0)),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                ImagePath = reader.GetString(3),
                                Phone = reader.GetString(4),
                                Address = reader.GetString(5),
                                Password = reader.GetString(6),
                                Email = reader.GetString(7),
                                NIC = reader.GetString(8),
                                Licence = reader.GetString(9)
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

        public UpdateCustomerRequest UpdateCustomer(int id,UpdateCustomerRequest updateCustomerRequest)
        {
            var cus = GetCustomerById(id);
            string updateQuery = @"UPDATE Customers SET FirstName=@firstName,LastName=@lastName,ImagePath=@imagePath,Phone=@phone,Address=@address,Password=@password,Email=@email,NIC=@nIC,Licence=@licence WHERE CustomerId= @id";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand(updateQuery, conn))
                {
                    command.Parameters.AddWithValue("@id", id);
                    command.Parameters.AddWithValue("@firstName", updateCustomerRequest.FirstName);
                    command.Parameters.AddWithValue("@lastName", updateCustomerRequest.LastName);
                    command.Parameters.AddWithValue("@imagePath", updateCustomerRequest.ImagePath);
                    command.Parameters.AddWithValue("@phone", updateCustomerRequest.Phone);
                    command.Parameters.AddWithValue("@address", updateCustomerRequest.Address);
                    command.Parameters.AddWithValue("@password", updateCustomerRequest.Password);
                    command.Parameters.AddWithValue("@email", updateCustomerRequest.Email);
                    command.Parameters.AddWithValue("@nIC", updateCustomerRequest.NIC);
                    command.Parameters.AddWithValue("@licence", updateCustomerRequest.Licence);
                    command.ExecuteNonQuery();


                }
            }
            return updateCustomerRequest;
        }

        public void DeleteCustomer(int id)
        {
            try
            {
                string deleteQuery = @"DELETE Customers FROM Customers WHERE CustomerId=@id";
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.ExecuteNonQuery();
                        Console.WriteLine("Customer deleted successfully");
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
