import * as React from 'react';
import './css/home.css';
import UserService, { User } from '../../Models/User';
import { Switch } from 'react-router';
import { Link } from 'react-router-dom';
import Ride from '../Ride/Ride';
import Display from '../Display/Display';
import { withRouter, Route } from 'react-router-dom';
import axios from 'axios';
import { arrayBufferToBase64 } from '../../utilities/util';
import { uploadServer, APIServer } from './../Connection/connection';
import OfferDetails from '../OfferDetails/OfferDetails';

type HomeProps = {
	history: any;
	match: any;
	location: any;
};

interface HomeState {
	displayDropDown: boolean;
	src: string;
	user: User;
	isOnBooking:boolean;
	isOnOfferring:boolean;
}
class Home extends React.Component<HomeProps, HomeState> {
	constructor(props: HomeProps) {
		super(props);
		this.state = {
			displayDropDown: false,
			src: '',
			user: {
				emailId: '',
				active: true,
				name: '',
				password: '',
				imageUploadedName: '',
				id: '',
			},isOnBooking:false,isOnOfferring:false
		};
		this.handleDropDown = this.handleDropDown.bind(this);
	}
	componentDidMount() {
		const { id } = this.props.match.params;
		axios.get(APIServer + 'User/getById', { params: { id: id } }).then((response) => {
			const user = response.data;
			axios
				.get(uploadServer + 'getProfileImage/' + user.imageUploadedName, {
					responseType: 'arraybuffer',
				})
				.then((response) => {
					const image = arrayBufferToBase64(response.data);
					this.setState({ src: 'data:;base64,' + image, user: { ...user } });
				});
		}).catch(error => {
			console.log(error);
		});
		axios.get(APIServer+'Booking/IsUnderBooking',{params:{userId:id}}).then(response=>{
			debugger;
			if(response.data)
			this.setState({isOnBooking:true})
		});

		axios.get(APIServer + 'Offerring/IsOfferredRide', { params: { userId: id } }).then(response => {
	debugger;
			if (response.data)
				this.setState({ isOnOfferring: true })
		});
	}

	shouldComponentUpdate() {
		return true;
	}
	handleDropDown() {
		this.setState((state) => {
			return { displayDropDown: !state.displayDropDown };
		});
	}
	render() {
		const { url } = this.props.match;
		const { id } = this.props.match.params;
		const { user,isOnBooking,isOnOfferring } = this.state;
		return (
			<>
				<div id='home'>
					<div id='head'>
						<span>Ya!</span>
					</div>
					<div id='info' className={this.state.displayDropDown ? 'displayDropDown' : ''}>
						<span>{user.name}</span>
						<img src={this.state.src} onClick={this.handleDropDown} className='userProfile' />
						<ul className='list dropdown'>
							<li>
								<Link to={url + '/content'}>Home</Link>
							</li>
							<li>
								<Link to={'/profile/' + id}>Profile</Link>
							</li>
							<li>
								<Link to={url + '/display'}>MyRides</Link>
							</li>
							<li>
								<Link to='/login'>LogOut</Link>
							</li>
						</ul>
					</div>
				</div>

				<Switch>
					<Route path={this.props.match.path + '/content'}>
						<div id='content'>
							<p>Hey {user.name}!</p>
							<div className={'book '.concat(isOnBooking ?'disabled':'')}>
								<Link to={this.props.match.url + '/ride/book'}>Book A Ride</Link>
							</div>
							<div className={'offer '.concat(isOnOfferring ? 'disabled' : '')}>
								<Link to={this.props.match.url + '/ride/offer'}>Offer A Ride</Link>
							</div>
						</div>
					</Route>
					<Route
						exact
						path={this.props.match.path + '/ride/book'}
						render={(props) => <Ride isOnBooking={true} isOnUpdate={false} />}
					/>
					<Route
						path={this.props.match.path + '/ride/book/update/:bookingId'}
						render={(props) => <Ride isOnBooking={true} isOnUpdate={true} />}
					/>
					<Route exact path={[this.props.match.path + '/offerDetails/all']}><OfferDetails IsOnSingleOffer={false}/></Route>
					<Route path={[this.props.match.path + '/offerDetails/:offerId']}><OfferDetails IsOnSingleOffer={true}/></Route>
					<Route
						exact
						path={this.props.match.path + '/ride/offer'}
						render={(props) => <Ride isOnBooking={false} isOnUpdate={false} />}
					/>
					<Route
						path={this.props.match.path + '/display'}
						render={(props) => <Display id={this.props.match.params.id} />}
					/>
					<Route
						path={this.props.match.path + '/ride/offer/update/:offerId'}
						render={(props) => <Ride isOnBooking={false} isOnUpdate={true} />}
					/>
				</Switch>
			</>
		);
	}
}

export default withRouter(Home);
