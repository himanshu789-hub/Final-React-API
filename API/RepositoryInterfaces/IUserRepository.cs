﻿using System.Collections.Generic;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
namespace CarPoolAPI.RepositoryInterfaces {
    public interface IUserRepository {
        public User Create (UserDTO postUser);
        public bool LogIn (int userId, string password);
        public User GetById (int userId);
        public List<User> GetAll ();
        public bool Delete (int userId);

        public User Update (UserDTO user);
    }
}