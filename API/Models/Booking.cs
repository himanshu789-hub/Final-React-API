using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using CarPoolAPI.Enums;

namespace CarPoolAPI.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        public bool Active { get; set; }

        [Column(TypeName ="nvarchar(15)")]
        public BookingStatus BookingStatus { get; set; }

        public float FarePrice { get; set; }

        public DateTime DateTime { get; set; }

        public DateTime DepartingTime { get; set; }
        
        public DateTime EndTime { get; set; }

        public Location Source { get; set; }

        public Location Destination { get; set; }
        
        public int UserId { get; set; }
         
        public int OfferId { get; set; }
        
        public int SeatsBooked { get; set; }
        
        public virtual User User { get; set; }
        
        public virtual Offerring Offerring { get; set; }


    }
}
