using Car_Rental_API.Database;
using Car_Rental_API.IRepository;
using Car_Rental_API.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace Car_Rental_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Configure Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Retrieve connection strings from configuration
            var masterConnectionString = builder.Configuration.GetConnectionString("MasterConnection");
            var databaseConnectionString = builder.Configuration.GetConnectionString("CarRentalManagementConnection");

            // Register DatabaseInitializer as a singleton service
            builder.Services.AddSingleton(new DatabaseInitializer(masterConnectionString, databaseConnectionString));
            builder.Services.AddSingleton<ICarRepository>(provider => new CarRepository(databaseConnectionString));
            builder.Services.AddSingleton<ICustomerRepository>(provider => new CustomerRepository(databaseConnectionString));
            builder.Services.AddSingleton<IRentalRequestRepository>(provider => new RentalRequestRepository(databaseConnectionString));

            builder.Services.AddCors(opt =>
            {
                opt.AddDefaultPolicy(pol =>
                {
                    pol.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });


             var app = builder.Build();

            // Initialize the database
            InitializeDatabase(app);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors();
            app.UseStaticFiles();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }

        private static void InitializeDatabase(WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
                try
                {
                    dbInitializer.InitializeAsync();
                }
                catch (Exception ex)
                {
                    // Handle initialization errors (log, rethrow, etc.)
                    Console.WriteLine($"Database initialization failed: {ex.Message}");
                    // Optionally, you might want to terminate the application
                    // Environment.Exit(1);
                }
            }
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:5501") // Your client URL
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowSpecificOrigin");
            app.UseRouting();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

    }
}
