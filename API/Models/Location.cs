using System.ComponentModel.DataAnnotations;

namespace CarPoolAPI.Models
{
    public class Location
    {
        [Key]
        public int Id{ get; set; }
        public string Longitude{ get; set; }
        public string LocationName{ get; set; }
        public string Lattitude{ get; set; }
    }
}