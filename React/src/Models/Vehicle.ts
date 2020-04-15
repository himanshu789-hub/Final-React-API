interface IVehicle {
    NumberPlate: string;
    Type: number;
    Capacity: number;
}
class Vehicle implements IVehicle{
    NumberPlate: string;
    Type: number;
    Capacity: number;
}
export default Vehicle;