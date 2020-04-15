import * as React from "react";
import BookService, { Book } from "../../Models/Booking";
import UserService from "../../Models/User";
import "./css/styles.css";
import { withRouter } from "react-router";
import OfferService from "../../Models/Offerring";
import axios from "axios";
import { arrayBufferToBase64 } from "../../utilities/util";
import pointImg from "../../../public/assests/point.png";
import { uploadServer, APIServer } from "../Connection/connection";
import { BookingStatus } from "../../ServiceData/data";
import qs from 'qs';
interface IBookCardProps {
	book: any;
	isOnUpdate: boolean;
	history: any;
	location: any;
	match: any;
}

interface IBookCardState {
	src: string;
}
class BookCard extends React.Component<IBookCardProps, IBookCardState> {
	constructor(props) {
		super(props);
		this.state = { src: "" };
		this.handleCancel = this.handleCancel.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleReject = this.handleReject.bind(this);
		this.handleAccept = this.handleAccept.bind(this);
	}
	handleEdit() {
		const { history, book, location, match: { params: { id } } } = this.props;
		history.push('/home/' + id + '/ride/book/update/' + book.id);
	}
	handleCancel(event) {
		const { history, book, location } = this.props;
		const value = {
			bookingId: book.id,
			bookingStatus: 5
		}
		const payload: String = new String(JSON.stringify(value));
		debugger;
		axios.put(APIServer + 'booking/updatebookingstatus',
			payload
		);

	}
	handleReject() {
		const { book } = this.props;
		const value = {
			bookingId: book.id,
			bookingStatus: 3
		}
		const payload: String = new String(JSON.stringify(value));
		debugger;
		axios.put(APIServer + 'booking/updatebookingstatus',
			payload
		);

	}
	handleAccept() {
		const { book } = this.props;
		const value = {
			bookingId: book.id,
			bookingStatus: 2
		}
		const payload: String = new String(JSON.stringify(value));
		debugger;
		axios.put(APIServer + 'booking/updatebookingstatus',
			payload
		);

	}
	componentDidMount() {
		const { isOnUpdate, book } = this.props;
		console.log(book);
		const imgName = isOnUpdate ? book.offerring.user.imageUploadedName + "" : book.user.imageUploadedName + "";
		axios
			.get(
				uploadServer + "getProfileImage/" +
				imgName,
				{ responseType: "arraybuffer" }
			)
			.then(response => {
				const image = arrayBufferToBase64(response.data);
				this.setState({ src: "data:;base64," + image });
			});
	}
	render() {
		const { isOnUpdate, book } = this.props;
		const { src } = this.state;
		let status = "";
		if (book.bookingStatus == 1)
			status = "requested";
		else if (book.bookingStatus == 2)
			status = "accepted";
		else if (book.bookingStatus == 3)
			status = "rejected";
		else if (book.bookingStatus == 4)
			status = "destroyed";		else if (book.bookingStatus == 5)
			status = "cancel";
		else if (book.bookingStatus == 6)
			status = "completed";
		else
			status = "none";
		debugger;
		return (
			<div className={"bookCard ".concat(status)} key={book.id}>
				<div id="bookHead">
					<label>{isOnUpdate ? book.offerring.user.name : book.user.name}</label>
					<img src={src} />
				</div>
				<div id="section1">
					<div>
						<p>From</p>
						<p>{book.source.locationName}</p>
					</div>
					<img src={pointImg} />
					<div>
						<p>To</p>
						<p>{book.destination.locationName}</p>
					</div>
				</div>
				<div id="section2">
					<div id="showDate">
						<p>Date</p>
						<p>{(book.dateTime + "").substring(0, (book.dateTime + "").indexOf('T'))}</p>
					</div>
					<div id="price">
						<p id="label">Price</p>
						<p id="priceContent">{book.farePrice}</p>
					</div>
				</div>
				<div id="section3">
					<div id="seats">
						<p id="label">Seats</p>
						<p id="seatContent">{book.seatsBooked}</p>
					</div>
					<div>	{
						(status == "requested" || status == "accepted") ?
							(isOnUpdate ? <>{status == "requested" ?
								<label className="delete" onClick={this.handleCancel}><i className="far fa-trash-alt"></i></label> : ""}
								<label className="edit" onClick={this.handleEdit}><i className="fa fa-edit"></i></label>
							</> :
								(status != "accepted" ? <>
									<label className="reject" onClick={this.handleReject}><i className="fa fa-times"></i></label>
									<label className="accept" onClick={this.handleAccept}><i className="fa fa-check"></i></label>
								</> : '')
							) : <></>
					}
					</div>
				</div>
				<div id="section4">

				</div>
			</div>
		);
	}
}
export default withRouter(BookCard);

