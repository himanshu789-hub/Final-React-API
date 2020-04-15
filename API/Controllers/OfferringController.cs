using System;
using System.Collections.Generic;
using System.Net.Http.Formatting;
using CarPoolAPI.DTOModel;
using CarPoolAPI.Enums;
using CarPoolAPI.Models;
using CarPoolAPI.PostModel;
using CarPoolAPI.RepositoryInterfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CarPoolAPI.Controllers {
    [EnableCors ("AllowMyOrigin")]
    public class OfferringController : ControllerBase {
        readonly IOfferringRepository _repos;
        public OfferringController (IOfferringRepository repos) {
            _repos = repos;
        }

        [HttpPost]
        //POST
        public Offerring Create ([FromBody] OfferringDTO offerring) {

            return _repos.Create (offerring);
        }
        public bool Update ([FromBody] OfferringDTO offerring) {
            return _repos.Update (offerring);
        }

        [HttpGet]
        public List<Offerring> GetByEndPoints ([FromQuery] string form) {
            dynamic json = JObject.Parse (form);
            JObject SourceJson = json.Source;
            JObject DestinationJson = json.Destination;
            LocationDTO Source = SourceJson.ToObject<LocationDTO> ();
            LocationDTO Destination = DestinationJson.ToObject<LocationDTO> ();
            int SeatsRequired = json.SeatsRequired;
            return _repos.GetByEndPoints (Source, Destination, SeatsRequired);
        }
        [HttpGet]
        public bool IsOfferredRide(int userId){
          return  _repos.IsUnderOfferring(userId);
        }
        //DONE
        [HttpGet]
        public Offerring GetById ([FromQuery] int id) {
            return _repos.GetById (id);
        }

        [HttpGet]
        public List<Offerring> GetByUserId ([FromQuery] int userId) {
            return _repos.GetByUserId (userId);
        }

        [HttpDelete]
        public bool Delete ([FromBody] String data) {
            dynamic json = JObject.Parse(data);
            int offerId = json.OfferId;
            return _repos.Delete (offerId);
        }

        [HttpPut]
        public string HandleNextLocation ([FromBody] String data) {
            dynamic json = JObject.Parse (data);
            
            int OfferId = json.OfferId;
            return _repos.HandleNextLocation (OfferId);
        }
        
        [HttpPut]
        public bool UpdateLocation ([FromBody] String data) {
            dynamic json = JObject.Parse (data);
            int OfferId = json.OfferId;
            string NextLocation = json.ReachedLocation;
            return _repos.UpdateLocation (OfferId, NextLocation);
        }

        [HttpPut]
        public bool StartRide ([FromBody] String data) {
            dynamic json = JObject.Parse (data);
            int offerId = json.OfferId;
            return _repos.StartRide (offerId);
        }
    }
}