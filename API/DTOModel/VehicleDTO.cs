using CarPoolAPI.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarPoolAPI.PostModel
{
    public class VehicleDTO
    {
        public int Id { get; set; }
        public string NumberPlate { get; set; }
        public string Type { get; set; }
        public int MaxOffer { get; set; }
        public int Capacity { get; set; }
        public Boolean Active{ get; set; }
    }
}
