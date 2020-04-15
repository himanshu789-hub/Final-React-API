using CarPoolAPI.DTOModel;
using CarPoolAPI.Enums;
using System;

namespace CarPoolAPI.PostModel
{
    public class BookingDTO
    {
        public int Id { get; set; }

        public LocationDTO Source { get; set; }

        public LocationDTO Destination { get; set; }

        public BookingStatus BookingStatus { get; set; }

        public float FarePrice { get; set; }

        public DateTime DateTime{get;set;}

        public DateTime EndTime { get; set; }

        public int UserId { get; set; }

        public int OfferId { get; set; }

        public int SeatsRequired{ get; set; }
    }
}
