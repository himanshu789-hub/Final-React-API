using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CarPoolAPI.Enums;

namespace CarPoolAPI.Models {
    public class Offerring {
        [Key]
        public int Id { get; set; }

        public bool Active { get; set; }

        public DateTime StartTime { get; set; }
        public bool IsRideStarted { get; set; }
        public DateTime EndTime { get; set; }

        [Column (TypeName = "nvarchar(15)")]
        public Discount Discount { get; set; }

        public Location CurrentLocation { get; set; }

        public Location Source { get; set; }

        public Location Destination { get; set; }
        public float PricePerKM { get; set; }

        public float TotalEarning { get; set; }

        public virtual User User { get; set; }

        public int VechicleRef { get; set; }

        public Vechicles Vechicles { get; set; }

        public int UserId { get; set; }

        public int SeatsOffered { get; set; }

        public int SeatsAvailable { get; set; }

        public ICollection<Booking> Bookings { get; set; }

        public ICollection<ViaPoints> ViaPoints { get; set; }

        public Offerring () {
            Bookings = new HashSet<Booking> ();
            ViaPoints = new HashSet<ViaPoints> ();
        }

    }
}