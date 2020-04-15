using CarPoolAPI.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace CarPoolAPI.Models
{
    public class CarPoolContext:DbContext
    {
        public CarPoolContext(DbContextOptions<CarPoolContext> options) : base(options) { }

        public CarPoolContext() { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Booking>().Property(e => e.BookingStatus).HasConversion(v => v.ToString(), v => (BookingStatus)Enum.Parse(typeof(BookingStatus), v));

            modelBuilder.Entity<Offerring>().Property(e => e.Discount).HasConversion(v => v.ToString(), v => (Discount)Enum.Parse(typeof(Discount), v));
            modelBuilder.Entity<Vechicles>().Property(e => e.Type).HasConversion(v => v.ToString(), v => (VehicleType)Enum.Parse(typeof(VehicleType), v));

            modelBuilder.Entity<User>().HasData(new User() { Name="Monu",Id=3301,Age=20,Gender="MALE",Password="monu"});
            modelBuilder.Entity<User>().HasData(new User() { Name="Abhinav",Id=3302,Age=22,Gender="MALE",Password="abhinav"});
            modelBuilder.Entity<User>().HasData(new User() { Name="Sreyash",Id=3306,Age=24,Gender="MALE",Password="sreyash"});
            modelBuilder.Entity<User>().HasData(new User() { Name="Priya",Id=3305,Age=21,Gender="FEMALE",Password="priya"});
            modelBuilder.Entity<User>().HasData(new User() { Name="Devansh",Id=3308,Age=24,Gender="MALE",Password="devansh"});
            
            modelBuilder.Entity<Offerring>().HasOne<Vechicles>(e=>e.Vechicles).WithOne(e => e.Offerring).HasForeignKey<Offerring>(f => f.VechicleRef);
            modelBuilder.Entity<Offerring>().HasMany(e => e.Bookings).WithOne(e => e.Offerring).HasForeignKey(f => f.OfferId);
            modelBuilder.Entity<Offerring>().HasMany(e => e.ViaPoints).WithOne(e => e.Offerring).HasForeignKey(f => f.OfferId);
            modelBuilder.Entity<User>().HasMany<Offerring>(e => e.Offerrings).WithOne(c => c.User).HasForeignKey(k=>k.UserId);
            modelBuilder.Entity<User>().HasMany(e => e.Bookings).WithOne(c => c.User).HasForeignKey(k=>k.UserId);
            
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            IConfiguration configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();
            var builder = new DbContextOptionsBuilder<CarPoolContext>();
            var connectionString = configuration.GetConnectionString("SqlConnection");
            optionsBuilder.UseSqlServer(connectionString);
        }

        public DbSet<Booking>  Bookings { get; set; }
        public DbSet<Offerring> Offerrings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ViaPoints> ViaPoints { get; set; }
        public DbSet<Vechicles> Vechicles { get; set; }


    }
}
