using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarPoolAPI.PostModel
{
    public class UserDTO
    {
        public string name { get; set; }
        public string emailId{ get; set; }
        public string password { get; set; }
        public int age { get; set; }
        public string gender { get; set; }
        public string imageUploadedName { get; set; }
    }
}
