using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
using System.Collections.Generic;

namespace CarPoolAPI.RepositoryInterfaces
{
    public interface IVehicleRepository
    {
        public Vechicles Create(VehicleDTO postVehicle);
        public bool Update(VehicleDTO postVehicle,int OfferId);
        public bool Delete(int id);
        public List<Vechicles> GetAll();
        public Vechicles GetById(int id);        
    }
}
