using System;
using System.Collections.Generic;
using System.Linq;
using CarPoolAPI.DTOModel;
using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
using CarPoolAPI.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;

namespace CarPoolAPI.RepositoryProcessory {
    public class OfferringRepository : IOfferringRepository {
        CarPoolContext _context;
        public OfferringRepository (CarPoolContext context) {
            _context = context;
        }
        public Offerring Create (OfferringDTO postOfferring) {
            Offerring offer = new Offerring {
                Active = true,
                Destination = new Location () { Lattitude = postOfferring.Destination.Lattitude, Longitude = postOfferring.Destination.Longitude, LocationName = postOfferring.Destination.LocationName },
                Source = new Location () { Lattitude = postOfferring.Source.Lattitude, Longitude = postOfferring.Source.Longitude, LocationName = postOfferring.Source.LocationName },
                CurrentLocation = new Location () { Lattitude = postOfferring.Source.Lattitude, Longitude = postOfferring.Source.Longitude, LocationName = postOfferring.Source.LocationName },
                UserId = postOfferring.UserId,
                SeatsOffered = postOfferring.MaxOfferSeats,
                SeatsAvailable = postOfferring.MaxOfferSeats,
                Discount = postOfferring.Discount,
                PricePerKM = postOfferring.PricePerKM,
                StartTime = postOfferring.StartTime,
                Vechicles = new Vechicles () { Active = true, Capacity = postOfferring.Vehicle.Capacity, NumberPlate = postOfferring.Vehicle.NumberPlate, Type = (VehicleType) Enum.Parse (typeof (VehicleType), postOfferring.Vehicle.Type.ToString ()) },
            };
            var offerring = _context.Offerrings.Add (offer).Entity;
            _context.SaveChanges ();
            foreach (LocationDTO point in postOfferring.ViaPoints) {
                _context.ViaPoints.Add (new ViaPoints { Location = new Location () { Lattitude = point.Lattitude, LocationName = point.LocationName, Longitude = point.Longitude }, OfferId = offerring.Id });
            }
            _context.SaveChanges ();

            return _context.Offerrings.Where (e => e.Id == offerring.Id).Include (e => e.ViaPoints).Include (e => e.Vechicles).Include (e => e.User).Single ();
        }

        public bool UpdateLocation (int offerId, string reachedLocation) {
            bool flag = false;
            using (var context = new CarPoolContext ()) {
                Offerring offer = context.Offerrings.Where (e => e.Id == offerId).Include (e => e.CurrentLocation).Include (e => e.Source).Include (e => e.Destination).Include (e => e.ViaPoints).ThenInclude (e => e.Location).Single ();
                Location CurrentLocation = offer.CurrentLocation;
                List<Location> route = new List<Location> ();
                route.Add (offer.Source);
                System.Console.WriteLine (offer.ViaPoints.Select (e => e.Location));
                route.AddRange (offer.ViaPoints.Select (e => e.Location).ToList ());
                route.Add (offer.Destination);
                Location tempLocation = route.Find (e => e.LocationName == reachedLocation);
                CurrentLocation.Lattitude = tempLocation.Lattitude;
                CurrentLocation.LocationName = tempLocation.LocationName;
                CurrentLocation.Longitude = tempLocation.Longitude;
                List<Booking> AcceptedBooking = context.Bookings.Where (e => e.OfferId == offerId && e.BookingStatus == BookingStatus.ACCEPTED).ToList ();
                foreach (Booking booking in AcceptedBooking) {
                    booking.BookingStatus = BookingStatus.COMPLETED;
                    booking.Active = false;
                }
                List<Booking> RejectedBooking = context.Bookings.Where (e => e.OfferId == offerId && e.BookingStatus == BookingStatus.REQUESTED).ToList ();
                foreach (Booking booking in RejectedBooking) {
                    booking.BookingStatus = BookingStatus.DESTROYED;
                    booking.Active = false;
                }
                if (CurrentLocation.LocationName == offer.Destination.LocationName) {
                    offer.Active = false;
                }
                context.SaveChanges ();
                flag = true;
            }
            return flag;
        }
        public bool Update (OfferringDTO putOfferring) {
            bool flag = true;
            if (IsUpdatable (putOfferring.Id)) {
                using (CarPoolContext context = new CarPoolContext ()) {
                    Offerring offer = context.Offerrings.Where (e => e.Id == putOfferring.Id).Single ();
                    offer.Source = new Location () { Lattitude = putOfferring.Source.Lattitude, Longitude = putOfferring.Source.Longitude, LocationName = putOfferring.Source.LocationName };
                    offer.Destination = new Location () { Lattitude = putOfferring.Destination.Lattitude, Longitude = putOfferring.Destination.Longitude, LocationName = putOfferring.Destination.LocationName };
                    offer.CurrentLocation = new Location () { Lattitude = putOfferring.Source.Lattitude, Longitude = putOfferring.Source.Longitude, LocationName = putOfferring.Source.LocationName };
                    offer.Discount = putOfferring.Discount;
                    offer.StartTime = putOfferring.StartTime;
                    offer.TotalEarning = 0;
                    context.ViaPoints.RemoveRange (context.ViaPoints.Where (e => e.OfferId == offer.Id).ToList ());
                    foreach (LocationDTO location in putOfferring.ViaPoints)
                        context.Add (new ViaPoints () { Location = new Location () { Lattitude = location.Lattitude, Longitude = location.Longitude, LocationName = location.LocationName }, OfferId = offer.Id });
                    context.SaveChanges ();
                }
                flag = true;
            } else
                flag = false;

            return flag;
        }

        public string HandleNextLocation (int offerId) {
            string nextLocation = null;
            using (var context = new CarPoolContext ()) {
                Offerring offer = context.Offerrings.Where (e => e.Id == offerId).Include (e => e.Source).Include (e => e.Destination).Include (e => e.CurrentLocation).Include (e => e.ViaPoints).ThenInclude (e => e.Location).Single ();
                List<string> route = new List<string> ();
                route.Add (offer.Source.LocationName);
                route.AddRange (offer.ViaPoints.Select (e => e.Location.LocationName).ToList ());
                route.Add (offer.Destination.LocationName);
                int nextLocationIndex = route.IndexOf (offer.CurrentLocation.LocationName) + 1;
                if (nextLocationIndex == route.Count ())
                    nextLocation = null;
                else
                    nextLocation = route[nextLocationIndex];
            }
            return nextLocation;
        }
        public bool IsUnderOfferring (int userId) {
               bool result = false;
               using(var context =  new CarPoolContext()){
                 result =   context.Offerrings.Where(e=>e.UserId==userId && e.Active).Count()>0;
               }
               return result;
        }
        public bool IsUpdatable (int id) {
            bool flag;
            using (var context = new CarPoolContext ()) {
                int count = context.Bookings.Where (e => e.OfferId == id && e.BookingStatus == BookingStatus.REQUESTED || e.BookingStatus == BookingStatus.ACCEPTED && e.DepartingTime == null).Count ();
                if (count == 0)
                    flag = true;
                else
                    flag = false;
            }
            return flag;
        }

        public bool StartRide (int OfferId) {
            bool result = false;
            using (var context = new CarPoolContext ()) {
                context.Offerrings.Where (e => e.Id == OfferId).Single ().IsRideStarted = true;
                context.SaveChanges ();
                result = true;
            }
            return result;
        }
        public bool Delete (int id) {
            bool result = false;
            using (var context = new CarPoolContext ()) {
                context.Offerrings.FirstOrDefault (e => e.Id == id).Active = false;
                context.SaveChanges ();
                result = true;
            }
            return result;
        }
        public List<Offerring> GetAll () {
            List<Offerring> offerrings = new List<Offerring> ();
            using (var context = new CarPoolContext ()) {
                offerrings = context.Offerrings.Include (e => e.Bookings).ThenInclude (e => e.User).Include (e => e.User).Include (e => e.Vechicles).Include (e => e.ViaPoints).ToList ();
            }
            return offerrings;
        }
        public List<Offerring> GetByEndPoints (LocationDTO Source, LocationDTO Destination, int seatsRequired) {
            List<Offerring> offerringsResult = new List<Offerring> ();
            List<Offerring> offerrings = _context.Offerrings.Where (e => e.Active).
            Include (e => e.ViaPoints).ThenInclude (e => e.Location).Include (e => e.User).Include (e => e.Vechicles).Include (e => e.Source).Include (e => e.Destination).ToList ();
            if (offerrings.Count == 0)
                return null;
            foreach (Offerring offer in offerrings) {
                List<string> route = new List<string> ();
                route.Add (offer.Source.LocationName);
                route.AddRange (_context.ViaPoints.Where (e => e.OfferId.Equals (offer.Id)).Select (e => e.Location.LocationName).ToList ());
                route.Add (offer.Destination.LocationName);
                List<string> path = new List<string> ();

                if (route.IndexOf (Source.LocationName) != -1 && route.IndexOf (Destination.LocationName) != -1) {
                    path.AddRange (route.GetRange (0, route.IndexOf (Destination.LocationName) + 1));
                } else
                    continue;

                int numberOfBookedSeats = 0;
                for (int i = 0; i <= route.IndexOf (Destination.LocationName); i++) {
                    numberOfBookedSeats -= _context.Bookings.Where (e => e.Active && e.Destination.LocationName == route[i]).Count ();
                    numberOfBookedSeats += _context.Bookings.Where (e => e.Active && e.Source.LocationName == route[i]).Count ();
                }
                if ((offer.SeatsOffered - (numberOfBookedSeats)) >= seatsRequired) {
                    offerringsResult.Add (offer);
                }
            }

            return offerringsResult;
        }
        public Offerring GetById (int id) {
            Offerring offer = _context.Offerrings.Where (e => e.Id == id).Include (e => e.ViaPoints).Include (e => e.Bookings).Include (e => e.Source).Include (e => e.Destination).Include (e => e.CurrentLocation).Single ();
            return offer;
        }
        public bool IsEndPointsWithinReachByOfferId (int offerId, Location source, Location destination) {
            bool flag = false;
            using (var context = new CarPoolContext ()) {
                List<Location> route = new List<Location> ();
                Offerring offer = context.Offerrings.FirstOrDefault (e => e.Id == offerId);
                route.Add (offer.Source);
                route.AddRange (context.ViaPoints.Where (e => e.OfferId.Equals (offer.Id)).Select (e => e.Location).ToList ());
                route.Add (offer.Destination);
                List<Location> path = new List<Location> ();

                if (route.IndexOf (source) != -1 && route.IndexOf (destination) != -1) {
                    flag = true;
                }
            }
            return flag;
        }
        public List<Offerring> GetByUserId (int id) {
            List<Offerring> offers = null;
            using (var context = new CarPoolContext ()) {
                offers = context.Offerrings.Where (e => e.UserId == id).Include(e=>e.User).Include(e=>e.Source).Include(e=>e.Destination).Include (e => e.Bookings).ThenInclude (e => e.Source).Include (e => e.Bookings).ThenInclude (e => e.Destination).Include (e => e.Bookings).ThenInclude(e => e.User).ToList ();
            }
            return offers;
        }
    }
}