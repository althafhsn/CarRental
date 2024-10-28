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

        public async Task<Customer> AddCustomer(Customer customer)
        {
            try
            {
                // Removed CarId from the insert query since it's an identity column
                string insertQuery = @"INSERT INTO Customers (CustomerId,FirstName,LastName,Email,Phone,Address,Licence,NIC,Password)
                                       VALUES (@customerId,@firstName,@lastName,@email,@phone,@address,@licence,@nic,@password);";
                // Use _connectionString passed from the constructor
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        // Bind the parameters
                        command.Parameters.AddWithValue("@customerId", customer.CustomerId);
                        command.Parameters.AddWithValue("@firstName",customer.FirstName);
                        command.Parameters.AddWithValue("@lastName",customer.LastName);
                        command.Parameters.AddWithValue("@email",customer.Email);
                        command.Parameters.AddWithValue("@phone",customer.Phone);
                        command.Parameters.AddWithValue("@address",customer.Address);
                        command.Parameters.AddWithValue("@licence",customer.Licence);
                        command.Parameters.AddWithValue("@nic",customer.NIC);
                        command.Parameters.AddWithValue("@password", customer.Password);


                        await command.ExecuteNonQueryAsync(); // Execute the query
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

        public async Task<ICollection<Customer>> GetCustomer()
        {
            var customers = new List<Customer>();
            string query = @"SELECT * FROM Customers";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            customers.Add(new Customer()
                            {
                                CustomerId = reader.GetString(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                Email = reader.GetString(3),
                                Phone = reader.GetString(4),
                                Address = reader.GetString(5),
                                Licence = reader.GetString(6),
                                NIC = reader.GetString(7),
                                Password = reader.GetString(8)
                            });

                        }


                    }
                }
            }
            return customers;
        }

        public async Task<Customer> GetCustomerById(string customerId)
        {
            string getQuery = @"SELECT * FROM Customers WHERE CustomerId = @customerId";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                    await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(getQuery, conn))
                {

                    cmd.Parameters.AddWithValue("@customerId", customerId);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Customer()
                            {
                                CustomerId = reader.GetString(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                Email = reader.GetString(3),
                                Phone = reader.GetString(4),
                                Address = reader.GetString(5),
                                Licence = reader.GetString(6),
                                NIC = reader.GetString(7),
                                Password = reader.GetString(8)
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

        public async Task<UpdateCustomerRequest> UpdateCustomer(string customerId, UpdateCustomerRequest updateCustomerRequest)
        {
            var cus = GetCustomerById(customerId);
            string updateQuery = @"UPDATE Customers SET FirstName=@firstName,LastName=@lastName,Email=@email,Phone=@phone,Address=@address,Licence=@licence,NIC=@nic WHERE CustomerId= @customerId";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                    await conn.OpenAsync();
                using (SqlCommand command = new SqlCommand(updateQuery, conn))
                {
                    command.Parameters.AddWithValue("@customerId", customerId);
                    command.Parameters.AddWithValue("@firstName", updateCustomerRequest.FirstName);
                    command.Parameters.AddWithValue("@lastName", updateCustomerRequest.LastName);
                    command.Parameters.AddWithValue("@email", updateCustomerRequest.Email);
                    command.Parameters.AddWithValue("@phone", updateCustomerRequest.Phone);
                    command.Parameters.AddWithValue("@address", updateCustomerRequest.Address);
                    command.Parameters.AddWithValue("@licence", updateCustomerRequest.Licence);
                    command.Parameters.AddWithValue("@nic", updateCustomerRequest.NIC);
                    await command.ExecuteNonQueryAsync();


                }
            }
            return updateCustomerRequest;
        }

        public async void DeleteCustomer(string customerId)
        {
            string deleteQuery = @"DELETE FROM Customers WHERE CustomerId=@customerId"; // Corrected SQL query
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@customerId", customerId);

                    // ExecuteNonQuery returns the number of affected rows
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        // Customer was deleted
                        Console.WriteLine("Customer deleted successfully.");
                    }
                    else
                    {
                        // No customer found with the provided ID
                        Console.WriteLine("Customer ID not found. No deletion occurred.");
                    }
                }
            }

        }


    }
}
