using CarPoolAPI.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarPoolAPI.Models
{
    public class ViaPoints
    {
        public int Id { get; set; }
        public Location Location { get; set; }
        public int OfferId { get; set; }
        public virtual Offerring Offerring { get; set; }
        public bool Active{ get; set; }
    }
}
