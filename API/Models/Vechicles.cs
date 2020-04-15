using CarPoolAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarPoolAPI.Models
{
    public class Vechicles
    {
        [Key]
        public int Id { get; set; }
        public string NumberPlate { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public VehicleType Type { get; set; }

        public Offerring Offerring { get; set; }
        public int Capacity { get; set; }
        public bool Active{ get; set; }
    }
}