using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using CarPoolAPI.Models;
using CarPoolAPI.RepositoryInterfaces;
using CarPoolAPI.RepositoryProcessory;
namespace CarPoolAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<CarPoolContext>(opt => opt.UseSqlServer(Configuration.GetConnectionString("SQLConnection")));
            services.AddCors(options =>
            {
                options.AddPolicy("AllowMyOrigin", builder => builder.WithOrigins("http://localhost:9000").AllowAnyHeader().AllowAnyMethod());
                
            });

            services.AddScoped<DbContext, CarPoolContext>();
            services.AddScoped<IBookingRepository, BookingRepository>();
            services.AddScoped<IOfferringRepository, OfferringRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddControllers().AddNewtonsoftJson
                (options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
           
            app.UseRouting();


            app.UseCors(options => options.WithOrigins("http://localhost:9000").AllowAnyHeader().AllowAnyMethod());
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action}"
                    );
            });
        }
    }
}
