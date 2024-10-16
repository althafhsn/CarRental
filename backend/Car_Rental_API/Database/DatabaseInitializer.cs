using System;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;

namespace Car_Rental_API.Database
{
    public class DatabaseInitializer
    {
        private readonly string _masterConnectionString;
        private readonly string _databaseConnectionString;

        public DatabaseInitializer(string masterConnectionString, string databaseConnectionString)
        {
            _masterConnectionString = masterConnectionString;
            _databaseConnectionString = databaseConnectionString;
        }

        public async Task InitializeAsync()
        {
            await CreateDatabaseIfNotExistsAsync();
            await CreateTablesIfNotExistsAsync();
        }

        private async Task CreateDatabaseIfNotExistsAsync()
        {
            string dbQuery = @"IF NOT EXISTS (SELECT * FROM sys.databases WHERE name='CarRentalManagement') 
                               CREATE DATABASE CarRentalManagement;";

            using (SqlConnection connection = new SqlConnection(_masterConnectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(dbQuery, connection))
                    {
                        await command.ExecuteNonQueryAsync();
                        Console.WriteLine("Database checked/created successfully.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error creating database: {ex.Message}");
                    throw;
                }
            }
        }

        private async Task CreateTablesIfNotExistsAsync()
        {
            // Corrected table definition with proper NVARCHAR lengths
            string tableQuery = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cars' AND xtype='U') 
                CREATE TABLE Cars(
                    CarId INT PRIMARY KEY, 
                    RegNo NVARCHAR(50) NOT NULL,
                    Brand NVARCHAR(50) NOT NULL,
                    Model NVARCHAR(50) NOT NULL,
                    HourlyPrice DECIMAL(10,2) NOT NULL,
                    DailyPrice DECIMAL(10,2) NOT NULL,
                    ImagePath NVARCHAR(255) NOT NULL,
                    SeatCount INT NOT NULL,
                    FuelType NVARCHAR(50) NOT NULL
                );

                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' AND xtype='U') 
                CREATE TABLE Customers(
                    CustomerId INT PRIMARY KEY,
                    FirstName NVARCHAR(50) NOT NULL,
                    LastName NVARCHAR(50) NOT NULL,
                    ImagePath NVARCHAR(MAX) NOT NULL,
                    Phone NVARCHAR(15) NOT NULL,
                    Address NVARCHAR(100) NOT NULL,
                    Password NVARCHAR(100) NOT NULL,
                    Email NVARCHAR(50) NOT NULL,
                    NIC NVARCHAR(15) NOT NULL,
                    Licence NVARCHAR(20) NOT NULL
                );
                  
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RentalRequests' AND xtype='U') 
                CREATE TABLE RentalRequests (
                    RentalId INT PRIMARY KEY, 
                    CustomerId INT NOT NULL,                  
                    CarId INT NOT NULL,                   
                    StartDate DATE NOT NULL,     
                    EndDate DATE NOT NULL,  
                    TotalPrice DECIMAL(10, 2) NOT NULL,   
                    Action NVARCHAR(50) DEFAULT 'Pending',
                    Status NVARCHAR(20)  NOT NULL ,  
                    RequestDate DATETIME DEFAULT GETDATE(),
                    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId), 
                    FOREIGN KEY (CarId) REFERENCES Cars(CarId)
                  );
                 IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CarBrand' AND xtype='U') 
                CREATE TABLE CarBrand (
                    BrandId INT PRIMARY KEY,
                    BrandName NVARCHAR(50) NOT NULL,
                );
           
                 IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CarModel' AND xtype='U') 
                CREATE TABLE CarModel (
                   ModelId INT PRIMARY KEY,
                   ModelName NVARCHAR(50) NOT NULL,
                   BrandId INT,
                   FOREIGN KEY (BrandId) REFERENCES CarBrand(BrandId),
);";

            // Correct insert query for Cars
            //string insertQuery = @"INSERT INTO Cars (CarId, RegNo, Brand, Model, HourlyPrice, DailyPrice, ImagePath, SeatCount, FuelType)
            //                       VALUES (1, 'Car_01', 'Toyota', 'Vessel', 300, 5000, 'grdfbg', 5, 'Petrol');";

            using (SqlConnection conn = new SqlConnection(_databaseConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    // Execute table creation
                    using (SqlCommand cmd = new SqlCommand(tableQuery, conn))
                    {
                        await cmd.ExecuteNonQueryAsync();
                        Console.WriteLine("Tables checked/created successfully.");
                    }

                    // Execute insert statement
                    //using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                    //{
                    //    int rowsAffected = await cmd.ExecuteNonQueryAsync();

                    //    if (rowsAffected > 0)
                    //    {
                    //        Console.WriteLine("Data inserted successfully.");
                    //    }
                    //    else
                    //    {
                    //        Console.WriteLine("No rows were inserted.");
                    //    }
                    //}
                }
                catch (SqlException sqlEx)
                {
                    Console.WriteLine($"SQL error during table creation or insertion: {sqlEx.Message}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error creating tables or inserting data: {ex.Message}");
                    throw;
                }
            }
        }
    }
}
