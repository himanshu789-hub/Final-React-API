import * as React from "react";
import UserService, { User } from "../../Models/User";
import "./css/display.css";
import OfferService from "../../Models/Offerring";
import BookService from "../../Models/Booking";
import BookCard from "../BookCard/BookCard";
import axios from "axios";
import { APIServer } from "../Connection/connection";
type DisplayProps = {
	history?: any;
	id?: string;
};
interface IDisplayState{
	bookRides:Array<any>;
	offerRidesBooking:Array<any>;
}
export default class Display extends React.Component<DisplayProps, IDisplayState> {
	constructor(props) {
		super(props);
		this.state={
			bookRides:[],
			offerRidesBooking:[]
		}
	}
	render() {
		const {id} = this.props;
        const {bookRides,offerRidesBooking} = this.state;
		// let getAllBookingOfAOffer = allOfferByUserId
		// 	.map(e => BookService.Books.filter(b => b.OfferId == e.Id))
		// 	.reduce(function(previous, current) {
		// 		return previous.concat(current);
		// 	});

		debugger;
		return (
			<div id="display">
				<div id="bookRide" key={1}>
					<p>Booked rides</p>
					{bookRides.map(e => {
					 return <BookCard isOnUpdate={true} book={e}></BookCard>;
					})}
				</div>
				<div id="offerRide" key={2}>
					<p>Offered rides</p>
					{offerRidesBooking.map(e => {
						 return <BookCard isOnUpdate={false} book={e}></BookCard>;
					})}
				</div>
			</div>
		);
	}
	componentDidMount(){
		const {id} = this.props;
		let offers;
		axios.get(APIServer+'booking/getbyUserId',{params:{userId:id}}).then(res=>{
			console.log(res.data);
           this.setState({bookRides:res.data});
		}).catch(err=>console.log(err));
		
		axios.get(APIServer+'booking/getallofferedrides',{params:{userId:id}}).then(res=>{
			this.setState({offerRidesBooking:res.data});
		});
	}
}