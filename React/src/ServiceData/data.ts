import UserService, { User } from "../Models/User";

export let BookingStatus = {
	NOTREQUESTED:0,REQUESTED:1,ACCEPTED:2,REJECTED:3,DESTROYED:4,CANCEL:5,COMPLETED:6
}
export let Discount = {
	ZERO: 0, FIVE: 5, TEN: 10, TWENTY: 20
}
export let VehicleType = 
    {
        BIKE:1,HATCHBACK:3,SEDAN:3,SUV:5,CONVERTIBLE:1,LIMO:7
}   
// export let Cities: Array<string> = [
// 	"Mumbai",
// 	"Madras",
// 	"Delhi",
// 	"Amritsar",
// 	"Pune",
// 	"Chennai",
// 	"Raipur"
// ];
// export let TimeInterval: Array<string> = [
// 	"5am - 9am",
// 	"9am - 12pm",
// 	"12pm - 3pm",
// 	"3pm - 6pm",
// 	"6pm - 9pm"
// ];
export const SampleUsers: Array<User> = [
	{
		id: "1",
		name: "Robert Browny Jr.",
		password: "browny123",
		emailId: "browny@gmail.com",
		active: true,
		imageUploadedName: "Rob.png"
	},
	{
		id: "2",
		name: "Morgan Stark",
		password: "morgan123",
		emailId: "morgan@gmail.com",
		active: true,
		imageUploadedName: "Mor.png"
	},
	{
		id: "3",
		name: "Tony Mark",
		password: "tony123",
		emailId: "tony@gmail.com",
		active: true,
		imageUploadedName: "Ton.png"
	},
	{
		id: "4",
		name: "J.P. King",
		password: "king123",
		emailId: "king@gmail.com",
		active: true,
		imageUploadedName: "Jpp.png"
	},
	{
		id: "5",
		name: "Jimmy Shergill",
		password: "jimmy123",
		emailId: "jimmy@gmail.com",
		active: true,
		imageUploadedName: "Jimmy.png"
	},
	{
		id: "6",
		name: "Sunny Arora",
		password: "sunny123",
		emailId: "sunny@gmail.com",
		active: true,
		imageUploadedName: "Sunny.png"
	},
	{
		id: "7",
		name: "R. Mahadavan",
		password: "rmaha123",
		emailId: "rmaha@gmail.com",
		active: true,
		imageUploadedName: "Rmaha.png"
	},
	{
		id: "8",
		name: "Jessica Paul",
		password: "jessica123",
		emailId: "jessica@gmail.com",
		active: true,
		imageUploadedName: "Jessica.png"
	},
	{
		id: "9",
		name: "Jassi Gill",
		password: "jassi123",
		emailId: "jassi@gmail.com",
		active: true,
		imageUploadedName: "Jassi.png"
	},
	{
		id: "10",
		name: "Jhonny Lever",
		password: "jhonney123",
		emailId: "jhonney@gmail.com",
		active: true,
		imageUploadedName: "Jhonney.png"
	},
	{
		id: "11",
		name: "Kabir Bedi",
		password: "kabir123",
		emailId: "kabir@gmail.com",
		active: true,
		imageUploadedName: "Kabir.png"
	}
];
