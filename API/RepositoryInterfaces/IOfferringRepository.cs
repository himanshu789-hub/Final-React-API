using System.Collections.Generic;
using CarPoolAPI.DTOModel;
using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;

namespace CarPoolAPI.RepositoryInterfaces {
        public interface IOfferringRepository {
            public Offerring Create (OfferringDTO postOfferring);
            public bool Delete (int id);
            public List<Offerring> GetByEndPoints (LocationDTO Source, LocationDTO Destination, int seatsRequired);
            public Offerring GetById (int id);
            public bool IsEndPointsWithinReachByOfferId (int OfferId, Location source, Location destination);
            public List<Offerring> GetAll ();
            public string HandleNextLocation (int offerId);
            public bool UpdateLocation (int offerId, string currentLocation);
            public List<Offerring> GetByUserId (int id);
            public bool Update (OfferringDTO postOfferring);
            public bool StartRide (int OfferId) ;
            public bool IsUnderOfferring(int offerId);
                //Why to have get all for admin, he can downlaod whole file instead of getting whole data}
            }
        }