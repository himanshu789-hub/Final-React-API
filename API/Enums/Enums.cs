using System;
using System.Collections.Generic;
using System.Text;

namespace CarPoolAPI.Enums
{
    public enum Discount
    {
    ZERO=0, FIVE = 5 , TEN = 10 , TWENTY = 20
    }
    public enum BookingStatus
    {
     NOTREQUESTED=0,REQUESTED,ACCEPTED,REJECTED,DESTROYED,CANCEL,COMPLETED
    }
     public enum VehicleType
    {
        MOPED=1,BIKE,HATCHBACK,SEDAN,SUV,CONVERTIBLE,LIMO
    }   
}
