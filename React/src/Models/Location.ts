export interface ILocation
{
     Id:number,
     Longitude:number ,
     LocationName:string ,
     Lattitude:number ,
}
class Location implements ILocation{
     Longitude: number;
     LocationName: string;
     Lattitude: number;
     Id: number;
}

export default Location;