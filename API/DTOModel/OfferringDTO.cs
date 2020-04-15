using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarPoolAPI.DTOModel;

namespace CarPoolAPI.PostModel
{
    public class OfferringDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }

        public Discount Discount { get; set; }

        public LocationDTO Source { get; set; }

        public LocationDTO Destination { get; set; }

        public float PricePerKM { get; set; }

        public int VehicleRef { get; set; }

        public int MaxOfferSeats { get; set; }

        public VehicleDTO Vehicle{get;set;}
    
        public List<LocationDTO> ViaPoints { get; set; }

         public Location Location{get;set;}
    }
}
