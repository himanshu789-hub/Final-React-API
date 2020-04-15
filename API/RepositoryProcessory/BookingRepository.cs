using System.Collections.Generic;
using System.Linq;
using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
using CarPoolAPI.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;
namespace CarPoolAPI.RepositoryProcessory {
    public class BookingRepository : IBookingRepository {
        CarPoolContext _context;
        public BookingRepository (CarPoolContext context) => _context = context;

        public Booking Create (BookingDTO postBooking) {
            Booking booking = new Booking {
                Active = true,
                BookingStatus = BookingStatus.REQUESTED,
                OfferId = postBooking.OfferId,
                UserId = postBooking.UserId,
                FarePrice = postBooking.FarePrice*(100-(int)(_context.Offerrings.Where(e=>e.Id==postBooking.OfferId).Single().Discount))/100,
                DateTime = postBooking.DateTime,
                SeatsBooked = postBooking.SeatsRequired,
                Source = new Location () { Lattitude = postBooking.Source.Lattitude, Longitude = postBooking.Source.Longitude, LocationName = postBooking.Source.LocationName },
                Destination = new Location () { Lattitude = postBooking.Destination.Lattitude, Longitude = postBooking.Destination.Longitude, LocationName = postBooking.Destination.LocationName },
            };
            var addedBooking = _context.Bookings.Add (booking);
            _context.SaveChanges ();
            return addedBooking.Entity;
        }
        public Booking AcceptBooking (BookingDTO postBooking) {
            Booking book = new Booking () {
                Active = true,
                BookingStatus = BookingStatus.ACCEPTED,
                OfferId = postBooking.OfferId,
            };

            using (var context = new CarPoolContext ()) {
                var booking = context.Bookings.Add (book);
                context.SaveChanges ();
                book = booking.Entity;
                //            context.Anounces.Where(e => e.Id == postBooking.AnnounceId).ToList().First().BookingRef = context.Bookings.Select(e => e.Id).ToList().Max();
                context.SaveChanges ();
            }
            return book;
        }
        public BookingStatus GetStatusById (int bookingId) => _context.Bookings.Find (bookingId).BookingStatus;
        public List<Booking> GetByOfferId (int offerId) {
            return _context.Bookings.ToList ().FindAll (e => e.Active == true && e.OfferId.Equals (offerId) && e.BookingStatus == BookingStatus.REQUESTED);
        }
        public bool UpdateStatus (int bookingId, BookingStatus bookingStatus) {
            bool result = false;
            if (bookingStatus == BookingStatus.ACCEPTED) {
                Booking booking = _context.Bookings.Where (b => b.Id.Equals (bookingId)).Single ();
                Offerring offer = _context.Offerrings.FirstOrDefault (e => e.Id == booking.OfferId);
                offer.TotalEarning += booking.FarePrice;
                booking.BookingStatus = BookingStatus.ACCEPTED;
                result = true;
            } else if (bookingStatus == BookingStatus.REJECTED) {

                Booking booking = _context.Bookings.FirstOrDefault (e => e.Id == bookingId);
                booking.BookingStatus = BookingStatus.REJECTED;
                booking.Active = false;
                result = true;
            } else if (bookingStatus == BookingStatus.CANCEL) {
                Booking booking = _context.Bookings.Where (b => b.Id.Equals (bookingId)).Single ();
                booking.BookingStatus = BookingStatus.CANCEL;
                booking.Active = false;
                result = true;
            }
            _context.SaveChanges ();

            return result;
        }
        public bool IsUnderBooking (int userId) {
            bool result = false;
            using (var context = new CarPoolContext ()) {
              result = context.Bookings.Where(e=>e.UserId==userId && e.Active).Count()>0;
            }
            return result;
        }
        public Booking Update (int BookingId, Location Source, Location Destination, float Distance, int OfferId) {
            Booking result = null;
            using (var context = new CarPoolContext ()) {
                Booking booking = context.Bookings.FirstOrDefault (e => e.Id == BookingId);
                // if (booking.BookingStatus == BookingStatus.ACCEPTED) {
                //     Offerring offer = context.Offerrings.FirstOrDefault (e => e.Id == booking.OfferId);
                //     offer.TotalEarning -= booking.FarePrice + (Distance * offer.PricePerKM);
                //     booking.FarePrice = offer.PricePerKM;
                // } else { //REQUESTED
                booking.Source = Source;
                booking.Destination = Destination;
                booking.OfferId = OfferId;
                booking.FarePrice = context.Offerrings.FirstOrDefault (e => e.Id == OfferId).PricePerKM * Distance;
                // }

                context.SaveChanges ();
                result = booking;
            }
            return result;
        }

        public Booking GetById (int bookingId) {
            Booking booking = null;
            using (var context = new CarPoolContext ()) {
                booking = context.Bookings.Where (e => e.Id == bookingId).Include (e => e.Source).Include (e => e.Destination).ToList () [0];
            }
            return booking;
        }
        public bool Delete (int bookingId) {
            Booking b = _context.Bookings.Where (b => b.Id == bookingId && b.Active == true).Single ();
            b.BookingStatus = BookingStatus.COMPLETED;
            b.Active = false;
            _context.SaveChanges ();
            return true;
        }
        public List<Booking> GetAll () {
            List<Booking> Bookings = new List<Booking> ();
            using (var context = new CarPoolContext ()) {
                Bookings = context.Bookings.Include (e => e.User).ToList ();
            }
            if (Bookings.Count == 0)
                return null;
            return Bookings;

        }

        public List<Booking> GetByUserId (int userId) {
            List<Booking> bookings = null;
            using (var context = new CarPoolContext ()) {
                bookings = context.Bookings.Where (e => e.UserId == userId).Include (e => e.User).Include (e => e.Offerring).ThenInclude (e => e.User).Include (e => e.Source).Include (e => e.Destination).ToList ();
            }
            return bookings;
        }

        public List<Booking> GetAllOfferRideByUserId (int userId) {
            List<Booking> bookings = null;
            using (var context = new CarPoolContext ()) {
                var offersId = context.Offerrings.Where (e => e.UserId == userId).Select (e => e.Id).ToList ();
                bookings = context.Bookings.Where (e => offersId.Contains (e.OfferId)).Include (e => e.User).Include (e => e.Source).Include (e => e.Destination).ToList ();
            }
            return bookings;
        }
    }
}