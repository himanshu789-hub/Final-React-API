using System.Collections.Generic;
using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;

namespace CarPoolAPI.RepositoryInterfaces {
    public interface IBookingRepository {
        Booking Create (BookingDTO postBooking);
        Booking AcceptBooking (BookingDTO postBooking);
        BookingStatus GetStatusById (int id);
        List<Booking> GetByOfferId (int offerId);

        public bool IsUnderBooking(int userId);
        bool UpdateStatus (int bookingId, BookingStatus bookingStatus);
        bool Delete (int bookingId);
        List<Booking> GetAll ();
        Booking GetById (int BookingId);
        List<Booking> GetAllOfferRideByUserId (int userId);
        List<Booking> GetByUserId (int userId);
        public Booking Update (int bookingId, Location Source, Location Destination, float Distance, int OfferId);

    }
}