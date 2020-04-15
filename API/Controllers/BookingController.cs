using System;
using System.Collections.Generic;
using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
using CarPoolAPI.RepositoryInterfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarPoolAPI.Controllers {
    public class BookingController : ControllerBase {
        readonly IBookingRepository _repos;

        public BookingController (IBookingRepository repos) => _repos = repos;

        [HttpGet]
        public BookingStatus ViewStatus ([FromQuery] int bookingId) {
            return _repos.GetStatusById (bookingId);
        }
        public List<Booking> GetByUserId ([FromQuery] int userId) {
            return _repos.GetByUserId (userId);
        }

        [HttpGet]
        public List<Booking> GetAllByOfferId ([FromQuery] int offerId) {
            return _repos.GetByOfferId (offerId);
        }
        public List<Booking> GetAllOfferedRides ([FromQuery] int userId) {
            return _repos.GetAllOfferRideByUserId (userId);
        }

        [HttpPost]
        public Booking Create ([FromBody] BookingDTO booking) {
            return _repos.Create (booking);
        }

        [HttpGet]
        public Booking GetById ([FromQuery] int id) {
            return _repos.GetById (id);
        }

        [HttpPut]
        public Booking AcceptBooking ([FromBody] BookingDTO booking) {
            return _repos.AcceptBooking (booking);
        }

        [HttpPut]
        public Booking AddAnnounceBooking ([FromBody] BookingDTO postBooking) {
            return _repos.AcceptBooking (postBooking);
        }

        [HttpPut]
        public bool UpdateBookingStatus ([FromBody] String data) {
            dynamic json = JObject.Parse (data);

            int bookingStatus = json.bookingStatus;
            int bookingId = json.bookingId;
            return _repos.UpdateStatus (bookingId, (BookingStatus) bookingStatus);

        }

        [HttpGet]
        public bool IsUnderBooking (int userId) {
             return _repos.IsUnderBooking(userId);
        }

        [HttpGet]
        public List<Booking> GetAll () {
            return _repos.GetAll ();
        }

        [HttpPut]
        public Booking Update (int Id, Location Source, Location Destination, float Distance, int OfferId) {
            return _repos.Update (Id, Source, Destination, Distance, OfferId);
        }
    }
}