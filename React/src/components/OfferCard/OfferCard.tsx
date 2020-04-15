import * as React from 'react';
import './css/offerCard.css';
import { withRouter } from 'react-router';
import BookService, { Book, IBookDTO, BookDTO } from '../../Models/Booking';
import { arrayBufferToBase64, convertUrl } from '../../utilities/util';
import axios from 'axios';
import pointImg from '../../../public/assests/point.png';
import { uploadServer, APIServer } from '../Connection/connection';
import Location from './../../Models/Location';
interface OfferCardProps {
	offer: any;
	key?: string;
	isOnUpdate: boolean;
	history: any;
	location: any;
	match: any;
	bookRequest?: Book;
}
interface IOfferState {
	msg: string;
	imagePreview: string;
}
class OfferCard extends React.Component<OfferCardProps, IOfferState> {
	constructor(props) {
		super(props);
		this.state = {
			msg: '',
			imagePreview: ''
		};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.startRide = this.startRide.bind(this);
		this.handleOfferring = this.handleOfferring.bind(this);
	}
	startRide() {
		const { offer } = this.props;
		const data = {
			OfferId: offer.id
		}
		const str: String = new String(JSON.stringify(data));
		axios.put(APIServer + 'Offerring/StartRide', str).then(res => {
			this.props.history.push(this.props.location.url);
		});
	}
	handleDelete(event) {
		const { offer,history,match:{params:{id}} } = this.props;
		const data = {
			OfferId: offer.id
		}
		const str: String = new String(JSON.stringify(data));
		axios.delete(APIServer + 'Offerring/Delete',{data:str}).then(res=>{
           history.push('/home/'+id+'/display');
		});
	}
	handleEdit(event) {
		const { history, offer, match: { params: { id } } } = this.props;
		history.push('/home/' + id + '/offerDetails/' + offer.id);
	}
	async	handleOfferring(event) {
		const { offer, history } = this.props;
		const {
			bookRequest: { Destination, Source, DateTime, UserId, SeatsRequired },
		} = this.props;
		const {
			location: { pathname },
		} = this.props;
		let book: BookDTO = new BookDTO();
		book.Source = new Location();
		book.Destination = new Location();
		var data = {
			countryRegion: 'IN',
			addressLine: Source,
			key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
		};
		debugger;
		await axios
			.get('http://dev.virtualearth.net/REST/v1/Locations', {
				params: { ...data, addressLine: Source },
			})
			.then((response) => {
				const coordinates = response.data.resourceSets[0].resources[0].point.coordinates;
				book.Source.LocationName = Source;
				book.Source.Lattitude = coordinates[0];
				book.Source.Longitude = coordinates[1];
			})
			.catch((error) => {
				console.log(error);
			});
		await axios
			.get('http://dev.virtualearth.net/REST/v1/Locations', {
				params: { ...data, addressLine: Destination },
			})
			.then((response) => {
				const coordinates = response.data.resourceSets[0].resources[0].point.coordinates;
				book.Destination.LocationName = Destination;
				book.Destination.Lattitude = coordinates[0];
				book.Destination.Longitude = coordinates[1];
			})
			.catch((error) => {
				console.log(error);
			});
		book.OfferId = offer.id;
		book.FarePrice = offer.pricePerKM;
		book.DateTime =  new Date(DateTime.toUTCString());
		book.SeatsRequired = SeatsRequired;
		book.UserId = UserId;
		axios.post(APIServer + 'Booking/Create', { ...book }).then(res=>{
			debugger;
		});
	}
	render() {
		const { isOnUpdate, offer, key } = this.props;
		console.log(offer);

		return (
			<div className={'offerCard'.concat(isOnUpdate ? (offer.active == true ? ' active' : ' notActive') : ' hovering')} key={key}>
				<div id='offerHead'>
					<label>{offer.user.name}</label>
					<img src={this.state.imagePreview} />
				</div>
				<div id='section1'>
					<div >
						<p>From</p>
						<p>{offer.source.locationName}</p>
					</div>
					<div><img src={pointImg} /></div>
					<div >
						<p>To</p>
						<p>{offer.destination.locationName}</p>
					</div>
				</div>
				<div id='section2'>
					<div id='showDate'>
						<p>Date</p>
						<p>{(offer.startTime + "").substring(0, (offer.startTime + "").indexOf('T'))}</p>
					</div>
					<div id='price'>
						<p id='label'>Price</p>
						<p id='priceContent'>{offer.pricePerKM}</p>
					</div>
				</div>
				<div id='section3'>
					<div id='seats'>
						<p id='label'>Seats</p>
						<p id='seatContent'>{offer.seatsAvailable}</p>
					</div>
				</div>
				{offer.active == true ? isOnUpdate ? (
					<div id='section4'>
						{offer.isRideStarted == false ? <><label className='edit' onClick={this.handleEdit}>
							<i className='fa fa-edit'></i>
						</label>
							<span className='canOfferEditmessage'>{this.state.msg}</span>
							<label className='delete' onClick={this.handleDelete}>
								<i className='far fa-trash-alt'></i>
							</label></> :
							<>
								<button className="startRide" onClick={this.startRide}>Start Ride</button></>}
					</div>) : (
						<div id="section4">	<label className='selectOffer' onClick={this.handleOfferring}>
							<i className='fa fa-check'></i>
						</label></div>
					)
					: ''}
			</div>);
	}

	componentDidMount() {
		const { offer } = this.props;
		axios
			.get(uploadServer + 'getProfileImage/' + offer.user.imageUploadedName + "", {
				responseType: 'arraybuffer',
			})
			.then((response) => {
				const image = arrayBufferToBase64(response.data);
				this.setState({ imagePreview: 'data:;base64,' + image });
			});
	}
}

export default withRouter(OfferCard);

