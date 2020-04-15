using CarPoolAPI.RepositoryInterfaces;
using CarPoolAPI.Models;
using System.Linq;
using System.Collections.Generic;
using CarPoolAPI.PostModel;
namespace CarPoolAPI.RepositoryProcessory
{
    public class UserRepository : IUserRepository
    {
        CarPoolContext _context;
        public UserRepository(CarPoolContext context) => _context = context;

        public User Create(UserDTO pUser)
        {
            User user = new User
            {
                Name = pUser.name,
                Password = pUser.password,
                Age = pUser.age,
                Gender = pUser.gender,
                ImageUploadedName = pUser.imageUploadedName,
                Active = true,
                EmailId=pUser.emailId
            };
            var addedUser = _context.Users.Add(user);
            _context.SaveChanges();

            return addedUser.Entity;
        }   //DONE

        public bool Delete(int userId)
        {
            using (var context = new CarPoolContext())
            {
                context.Users.FirstOrDefault(e => e.Id == userId).Active = false;
                context.SaveChanges();
            }
            return true;
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        } //DONE

        public User GetById(int userId)
        {
            return _context.Users.Find(userId);
        }   //DONE

        public bool LogIn(int userId, string password)
        {
            return _context.Users.Where(e => e.Id == userId && e.Password == password) != null;
        }

    }
}
