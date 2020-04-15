using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
using CarPoolAPI.RepositoryInterfaces;
using System.Collections.Generic;
using System.Linq;
using System;

namespace CarPoolAPI.RepositoryProcessory
{
    public class VehicleRepository:IVehicleRepository
    {
        private readonly Dictionary<VehicleType, int> VehicleCapacity = new Dictionary<VehicleType, int> {
        [VehicleType.MOPED] = 2,[VehicleType.HATCHBACK]=4,[VehicleType.LIMO]=10,[VehicleType.BIKE]=2,[VehicleType.CONVERTIBLE]=2,[VehicleType.SEDAN]=4,[VehicleType.SUV]=6
        };
        
        public Vechicles Create(VehicleDTO pVehicle)
        {
            // Vechicles tempVehicle = null;
            // using(var context = new CarPoolContext())
            // {
            //    var vechicle = context.Add(new Vechicles() { Capacity = VehicleCapacity[pVehicle.Type], NumberPlate = pVehicle.NumberPlate,Type=pVehicle.Type });
            //     context.SaveChanges();
            //     tempVehicle = vechicle.Entity;
            // }
            return null; 
        }

        public bool Delete(int id)
        {
            using(var _context =  new CarPoolContext())
            {
                _context.Vechicles.FirstOrDefault(e => e.Id == id).Active = false;
                _context.SaveChanges();
            }
            return true;
        }

        public List<Vechicles> GetAll()
        {
            List < Vechicles > vechicles = new List<Vechicles>();
            using(var context = new CarPoolContext())
            {
              vechicles = context.Vechicles.ToList();
            }
            return vechicles;
        }

        public Vechicles GetById(int id)
        {
            Vechicles vehicle;
            using(var context = new CarPoolContext())
            {
                vehicle = context.Vechicles.Find(id);
            }
            return vehicle;
        }

        public bool Update(VehicleDTO pVehicle,int OfferId)
        {
            bool flag = false;
          
            // pVehicle.Capacity = VehicleCapacity[pVehicle.Type];
            // if (pVehicle.Capacity <= pVehicle.MaxOffer)
            //     return false;
            //     using (var context = new CarPoolContext())
            // {
            //     if (context.Offerrings.Find(pVehicle.Id).EndTime == DateTime.MinValue)
            //     {
            //         Offerring offer = context.Offerrings.Single(e => e.Id == OfferId);
            //          int count = context.Bookings.Where(e => e.OfferId == OfferId && e.Active && (e.BookingStatus==BookingStatus.REQUESTED||e.BookingStatus==BookingStatus.ACCEPTED)).Count();
            //         if (pVehicle.MaxOffer >= offer.SeatsOffered && count <= pVehicle.Capacity )
            //         {
            //                 Vechicles vechicles = context.Vechicles.Find(pVehicle.Id);
            //                 vechicles.NumberPlate = pVehicle.NumberPlate;
            //                 vechicles.Type =(int) Enum.Parse(typeof(VehicleType), pVehicle.Type);
            //                 vechicles.Capacity = VehicleCapacity[vechicles.Type];
            //         }
            //             offer.SeatsOffered = pVehicle.MaxOffer;

            //         context.SaveChanges();
            //         flag = true;

            //         }
            //         else
            //             flag = false;
            //     }
             return flag;

        }
    }
}
