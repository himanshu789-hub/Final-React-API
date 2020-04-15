using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;
using System;

namespace CarPoolAPI.Models
{
    public class CarPoolSbContextFactory : IDesignTimeDbContextFactory<CarPoolContext>
    {
        public CarPoolContext CreateDbContext(string[] args)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json").Build();
            var builder = new DbContextOptionsBuilder<CarPoolContext>();
            var connectionString = configuration.GetConnectionString("SqlConnection");

            builder.UseSqlServer(connectionString);

            var dbContext = (CarPoolContext)Activator.CreateInstance(

                typeof(CarPoolContext), builder.Options);
            return dbContext;
            
        }
    }
}
