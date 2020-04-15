import * as React from 'react';
import './css/ride.css';
import { BookingStatus, VehicleType } from '../../ServiceData/data';
import Offerring, { Offer, OfferDTO } from '../../Models/Offerring';
import { withRouter } from 'react-router-dom';
import UserService, { User } from '../../Models/User';
import { convertUrl } from '../../utilities/util';
import Matches from './Matches';
import { CityPattern, DatePattern, NumberPlatePattern } from '../../RegularExpression/regexp';
import axios from 'axios';
import { Book, IBookDTO } from '../../Models/Booking';
import DateTimePicker from 'react-datetime-picker';
import Vehicle from '../../Models/Vehicle';
import { APIServer } from './../Connection/connection';
import { ILocation } from '../../Models/Location';
import Location from './../../Models/Location';
interface IRideProps {
	isOnBooking: boolean;
	history: any;
	match: any;
	location: any;
	isOnUpdate: boolean;
}
interface IRideState {
	Toogle: boolean;
	Booking: Book;
	ShowRides: boolean;
	IsSlideRight: boolean;
	User: User;
	FormMsg: string;
	ToMsg: string;
	TimeMsg: string;
	ViaPointMsg: string;
	SeatsMsg: string;
	PriceMsg: string;
	ShouldValidate: boolean;
	ShowOfferForm: boolean;
	DateMsg: string;
	IsOnUpdate: boolean;
	Offer: Offer;
	FromResult: JSX.Element;
	ViaPointResult: Array<JSX.Element>;
	ToResult: JSX.Element;
	VehicleInfoMsg: string;
	matchOffer: Array<Offer>;
}

class Ride extends React.Component<IRideProps, IRideState> {
	constructor(props) {
		super(props);
		const { isOnBooking, isOnUpdate } = this.props;
		this.state = {
			Toogle: isOnBooking,
			ShowOfferForm: !isOnBooking,
			ShowRides: false,
			IsSlideRight: isOnBooking,
			User: {
				active: true,
				emailId: '',
				name: '',
				password: '',
				imageUploadedName: '',
			},
			FormMsg: '',
			PriceMsg: '',
			SeatsMsg: '',
			TimeMsg: '',
			ToMsg: '',
			ViaPointMsg: 'Please Enter A Intermidate Point',
			ShouldValidate: false,
			DateMsg: '',
			IsOnUpdate: isOnUpdate,
			Offer: {
				...new Offer(),
				ViaPoints: [''],
				Vehicle: { Capacity: 0, NumberPlate: '', Type: 0 },
			},
			FromResult: null,
			ViaPointResult: [<></>],
			ToResult: <></>,
			Booking: new Book(),
			VehicleInfoMsg: '',
			matchOffer: null,
		};
		this.AddMoreStops = this.AddMoreStops.bind(this);
		//this.SelectTime = this.SelectTime.bind(this);
		this.displayOfferRightPanel = this.displayOfferRightPanel.bind(this);
		this.offerSubmitValidate = this.offerSubmitValidate.bind(this);
		this.onBookingSubmit = this.onBookingSubmit.bind(this);
		this.onOfferSubmit = this.onOfferSubmit.bind(this);
		this.onViaPointInput = this.onViaPointInput.bind(this);
		this.removeStop = this.removeStop.bind(this);
		this.handleSlider = this.handleSlider.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.validateBookingSubmit = this.validateBookingSubmit.bind(this);
		//	this.onFromInput = this.onFromInput.bind(this);
		this.handleAddressSelect = this.handleAddressSelect.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
	}

	componentDidMount() {
		const {
			match: {
				params: { offerId, id, bookingId },
			},
			isOnUpdate,
			isOnBooking,
		} = this.props;
		switch (isOnUpdate) {
			case true:
				{
					switch (isOnBooking) {
						case true:
							{
								axios
									.get(APIServer + 'Booking/getById', { params: { id: bookingId } })
									.then((response) => {
										let book: any = response.data;
										// axios
										// 	.get(APIServer + '/getbyId/' + book.UserId)
										// 	.then((response) => {
										// 		const user = response.data;
										// 		this.setState({
										// 			User: {
										// 				emailId: user.emailId,
										// 				name: user.name,
										// 				password: user.password,
										// 				age: user.age,
										// 				gender: user.gender,
										// 				id: user.id,
										// 				imageUploadedName: user.imageUploadedName,
										// 			},
										// 		});
										// 	})
										// 	.catch((error) => {
										// 		console.log(error);
										// 	});
										this.setState({
											Booking: {
												BookingStatus: book.bookingStatus,
												DateTime: book.dateTime,
												EndTime: book.endTime,
												FarePrice: book.farePrice,
												OfferId: book.offerId,
												SeatsRequired: book.seatsBooked,
												UserId: book.userId,
												Destination: book.destination.locationName,
												Source: book.source.locationName,
											},
											User: book.user,
										});
									})
									.catch((error) => {
										console.log(error);
									});
							}
							break;
						case false:
							{
								axios
									.get(APIServer + 'Offerring/getById', { params: { id: offerId } })
									.then((response) => {
										const Offer: any = response.data;
										this.setState({
											Offer: {
												Vehicle: Offer.vehicle,
												Destination: Offer.destination.locationName,
												Source: Offer.source.locationName,
												Discount: Offer.discount,
												Id: Offer.id,
												MaxOfferSeats: Offer.maxOfferSeats,
												PricePerKM: Offer.pricePerKM,
												StartTime: Offer.startTime,
												UserId: Offer.userId,
												VehicleRef: Offer.vehicleRef,
												ViaPoints: Offer.viaPoints.map((e) => e.locationName),
											},
											User: Offer.user,
											ViaPointResult: Offer.ViaPoints.map((e) => <></>),
										});
									})
									.catch((error) => {
										console.log(error);
									});
							}
							break;
					}
				}
				break;
			case false:
				{
					switch (isOnBooking) {
						case true:
							{
								axios
									.get(APIServer + 'User/getbyId', { params: { id: id } })
									.then((response) => {
										const user = response.data;
										this.setState({
											User: {
												emailId: user.emailId,
												name: user.name,
												password: user.password,
												age: user.age,
												gender: user.gender,
												id: user.id,
												imageUploadedName: user.imageUploadedName,
											},
										});
									})
									.catch((error) => {
										console.log(error);
									});

								this.setState({
									Booking: {
										...new Book(),
										UserId: id,
										Source: '',
										Destination: '',
										DateTime: null,
										SeatsRequired: 0,
									},
								});
							}
							break;
						case false:
							{
								axios
									.get(APIServer + 'User/getbyId', { params: { id: id } })
									.then((response) => {
										const user = response.data;
										this.setState({
											User: {
												emailId: user.emailId,
												name: user.name,
												password: user.password,
												age: user.age,
												gender: user.gender,
												id: user.id,
												imageUploadedName: user.imageUploadedName,
											},
										});
									})
									.catch((error) => {
										console.log(error);
									});
								this.setState({
									Offer: {
										VehicleRef: null,
										Id: null,
										Source: '',
										Destination: '',
										Discount: 0,
										StartTime: null,
										MaxOfferSeats: 0,
										Vehicle: Object.create(Vehicle),
										PricePerKM: 0,
										ViaPoints: [''],
										UserId: id,
									},
								});
							}
							break;
					}
				}
				break;
		}
	}

	handleSlider(event) {
		const { Toogle } = this.state;
		const {
			match: { url },
		} = this.props;
		let { history } = this.props;

		if (Toogle) {
			this.setState({
				Toogle: false,
				IsSlideRight: false,
				ShowOfferForm: true,
				ShowRides: false,
			});
			history.push(convertUrl(url, 'offer'));
		} else {
			this.setState({
				Toogle: true,
				IsSlideRight: true,
				ShowOfferForm: false,
				ShowRides: false,
			});
			history.push(convertUrl(url, 'book'));
		}
	}
	// SelectTime(event) {
	// 	const { value } = event.target;
	// 	const { IsOnUpdate: isOnUpdate } = this.state;
	// 	if (isOnUpdate)
	// 		this.setState((state) => {
	// 			return { Offer: { ...state.Offer, timeInterval: value } };
	// 		});
	// 	else this.setState({ timeInterval: value });
	// }
	handleAddressSelect(event) {
		const {
			target: {
				dataset: { stopindex, context, index },
				textContent,
			},
		} = event;
		const { isOnBooking } = this.props;
		if (context == 'viapoint') {
			this.setState((state) => {
				return {
					ViaPointResult: state.Offer.ViaPoints.map((e) => <></>),
					Offer: {
						...state.Offer,
						ViaPoints: [
							...state.Offer.ViaPoints.map((currValue, index) => {
								if (index == stopindex) return textContent;
								else return currValue;
							}),
						],
					},
				};
			});
		} else if (context == 'Source') {
			if (isOnBooking)
				this.setState((state) => {
					return { FromResult: <></>, Booking: { ...state.Booking, Source: textContent } };
				});
			else
				this.setState((state) => {
					return { FromResult: <></>, Offer: { ...state.Offer, Source: textContent } };
				});
		} else {
			if (isOnBooking)
				this.setState((state) => {
					return { ToResult: <></>, Booking: { ...state.Booking, Destination: textContent } };
				});
			else
				this.setState((state) => {
					return { ToResult: <></>, Offer: { ...state.Offer, Destination: textContent } };
				});
		}
	}
	async onViaPointInput(event) {
		let { name, value } = event.target;
		name = name.substring(1);
		const indexValue: number = Number(name);
		this.setState(
			(state) => {
				return {
					Offer: {
						...state.Offer,
						ViaPoints: [
							...state.Offer.ViaPoints.filter((e, index) => {
								if (index < indexValue) {
									if (e.length == 0) return ' ';
									else return e;
								}
							}),
							value,
							...state.Offer.ViaPoints.filter((currValue, index) => {
								if (index > indexValue) {
									if (currValue.length == 0) return ' ';
									else return currValue;
								}
							}),
						],
					},
				};
			},
			() => {
				console.log(this.state.Offer.ViaPoints);
			},
		);
		if (value.length != 0) {
			const lat = '22.7163528';
			const long = '75.8278007';
			const confidence_radius = '100000';
			var params = {
				query: value ?? ' ',
				maxResults: '10',
				userCircularMapView: lat + ',' + long + ',' + confidence_radius,
				includeEntityTypes: 'Address',
				userRegion: 'IN',
				countryFilter: 'IN',
				key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
			};
			debugger;
			const response = await axios.get('http://dev.virtualearth.net/REST/v1/Autosuggest', {
				params,
			});

			var addresses = response.data.resourceSets[0].resources[0].value.map((e) => e.address);

			this.setState((state) => {
				return {
					ViaPointResult: [
						...state.ViaPointResult.filter((e, index) => {
							if (index < indexValue) return <></>;
						}),
						<>
							{addresses.map((e, index) => (
								<span
									key={index}
									data-stopindex={indexValue}
									data-context='viapoint'
									className='address'
									onClick={this.handleAddressSelect}
								>
									{e.addressLine}
								</span>
							))}
						</>,
						...state.ViaPointResult.filter((e, index) => {
							if (index > indexValue) return <></>;
						}),
					],
				};
			});
		} else {
			this.setState((state) => {
				return {
					ViaPointResult: [
						...state.ViaPointResult.filter((e, index) => {
							if (index < indexValue) return e;
						}),
						<></>,
						...state.ViaPointResult.filter((e, index) => {
							if (index > indexValue) return e;
						}),
					],
				};
			});
		}
	}
	AddMoreStops() {
		this.setState((state) => {
			return {
				Offer: { ...state.Offer, ViaPoints: [...state.Offer.ViaPoints, ''] },
				ViaPointResult: [...state.ViaPointResult, <></>],
			};
		});
	}
	removeStop(event) {
		let index: number = Number(event.target.dataset.key);
		// this.ViaPoints = this.ViaPoints.map(e => e).filter((item, itemIndex) => { return itemIndex != index })
		this.setState((state) => {
			return {
				Offer: {
					...state.Offer,
					ViaPoints: [...state.Offer.ViaPoints].filter((item, itemIndex) => {
						return itemIndex != index;
					}),
				},
				ViaPointResult: [...state.ViaPointResult].filter((item, itemIndex) => {
					return itemIndex != index;
				}),
			};
		});
	}

	offerSubmitValidate(): boolean {
		let validateResult: boolean = false;
		const {
			IsOnUpdate: isOnUpdate,
			Offer: offer,
			Offer: { ViaPoints },
		} = this.state;

		//if (isOnUpdate) {
		if (offer.Source.length == 0 || !CityPattern.test(offer.Source)) {
			validateResult = true;
			this.setState({ FormMsg: 'Please Enter Source' });
		} else this.setState({ FormMsg: '' });

		if (offer.Destination.length == 0 || !CityPattern.test(offer.Destination)) {
			validateResult = true;
			this.setState({ ToMsg: 'Please Enter Destination' });
		} else this.setState({ ToMsg: '' });

		// if (offer.timeInterval.length == 0) {
		// 	validateResult = true;
		// 	this.setState({ TimeMsg: 'Please Select Time Interval' });
		// } else this.setState({ TimeMsg: '' });

		for (let i = 0; i < ViaPoints.length; i++) {
			if (ViaPoints[i].length == 0 || !CityPattern.test(ViaPoints[i])) {
				this.setState({ ShouldValidate: true });
				validateResult = true;
			}
		}

		if (offer.StartTime == null) {
			validateResult = true;
			this.setState({ DateMsg: 'Please Select Date And Ride Start Time' });
		} else {
			this.setState({ DateMsg: '' });
		}

		// if (offer.Date.length == 0 || !DatePattern.test(offer.date)) {
		// 	validateResult = true;
		// 	this.setState({ DateMsg: 'Please Enter Valid Date' });
		// } else this.setState({ DateMsg: '' });

		if (offer.MaxOfferSeats == 0) {
			validateResult = true;
			this.setState({ SeatsMsg: 'Select Seats' });
		} else this.setState({ SeatsMsg: '' });

		if (offer.PricePerKM == 0) {
			validateResult = true;
			this.setState({ PriceMsg: 'Enter Price' });
		} else this.setState({ PriceMsg: '' });
		if (
			offer.Vehicle.NumberPlate == null ||
			offer.Vehicle.NumberPlate == '' ||
			!NumberPlatePattern.test(offer.Vehicle.NumberPlate)
		) {
			validateResult = true;
			this.setState({ VehicleInfoMsg: 'Registration Number' });
		} else {
			this.setState({ VehicleInfoMsg: '' });
		}
		// } else {
		// 	const { from, to, timeInterval, date, price, ViaPoints } = this.state;
		// 	if (from.length == 0 || !CityPattern.test(from)) {
		// 		validateResult = true;
		// 		this.setState({ FormMsg: 'Please Enter Source' });
		// 	} else this.setState({ FormMsg: '' });

		// 	if (to.length == 0 || !CityPattern.test(to)) {
		// 		validateResult = true;
		// 		this.setState({ ToMsg: 'Please Enter Destination' });
		// 	} else this.setState({ ToMsg: '' });

		// 	if (timeInterval.length == 0) {
		// 		validateResult = true;
		// 		this.setState({ TimeMsg: 'Please Select Time Interval' });
		// 	} else this.setState({ TimeMsg: '' });

		// 	for (let i = 0; i < ViaPoints.length; i++) {
		// 		if (ViaPoints[i].length == 0 || !CityPattern.test(ViaPoints[i])) {
		// 			this.setState({ ShouldValidate: true });
		// 			validateResult = true;
		// 		}
		// 	}

		// 	if (date.length == 0 || !DatePattern.test(date)) {
		// 		validateResult = true;
		// 		this.setState({ DateMsg: 'Please Enter Valid Date' });
		// 	} else this.setState({ DateMsg: '' });

		// 	if (price.length == 0) {
		// 		validateResult = true;
		// 		this.setState({ PriceMsg: 'Enter Ride Fare' });
		// 	} else this.setState({ PriceMsg: '' });
		// }
		return validateResult;
	}
	async	onOfferSubmit(event) {

		let { history, location } = this.props;
		const {
			Offer: Offer,
			Offer: { ViaPoints },
			IsOnUpdate: IsOnUpdate,
		} = this.state;
		event.preventDefault();
		if (this.offerSubmitValidate()) return;
		var data = {
			countryRegion: 'IN',
			addressLine: Offer.Source,
			key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
		};
		let newOffer: OfferDTO = { ...new OfferDTO(), Vehicle: new Vehicle(), Source: new Location(), Destination: new Location(), ViaPoints: new Array<Location>() };
		await axios
			.get('http://dev.virtualearth.net/REST/v1/Locations', {
				params: { ...data, addressLine: Offer.Source },
			})
			.then((response) => {
				const coordinates = response.data.resourceSets[0].resources[0].point.coordinates;
				newOffer.Source.LocationName = Offer.Source;
				newOffer.Source.Lattitude = coordinates[0];
				newOffer.Source.Longitude = coordinates[1];
			})
			.catch((error) => {
				console.log(error);
			});
		await axios
			.get('http://dev.virtualearth.net/REST/v1/Locations', {
				params: { ...data, addressLine: Offer.Destination },

			})
			.then((response) => {
				const coordinates = response.data.resourceSets[0].resources[0].point.coordinates;
				newOffer.Destination.LocationName = Offer.Destination;
				newOffer.Destination.Lattitude = coordinates[0];
				newOffer.Destination.Longitude = coordinates[1];
			})
			.catch((error) => {
				console.log(error);
			});
		for (let i = 0; i < ViaPoints.length; i++) {
			await axios
				.get('http://dev.virtualearth.net/REST/v1/Locations', {
					params: { ...data, addressLine: ViaPoints[i] },
				})
				.then((response) => {
					const coordinates = response.data.resourceSets[0].resources[0].point.coordinates;

					newOffer.ViaPoints[i] = new Location();
					newOffer.ViaPoints[i].LocationName = Offer.ViaPoints[i];
					newOffer.ViaPoints[i].Lattitude = coordinates[0];
					newOffer.ViaPoints[i].Longitude = coordinates[1];
				})
				.catch((error) => {
					console.log(error);
				});
		}
		newOffer.Discount = Offer.Discount;
		newOffer.MaxOfferSeats = Offer.MaxOfferSeats;
		newOffer.PricePerKM = Offer.PricePerKM;
		newOffer.StartTime = Offer.StartTime;
		newOffer.UserId = Offer.UserId;
		newOffer.Vehicle = Offer.Vehicle;
		if (IsOnUpdate) {
			axios
				.put(APIServer + '/Offerring/Update', {
					data: {
						offerring: newOffer,
					},
				})
				.then((respose) => {
					if (respose.data) history.push(convertUrl(location.pathname, 'display'));
					else return <>Sorry</>;
				});
		} else {
			debugger;
			axios
				.post(APIServer + 'Offerring/Create', {
					...newOffer
				})
				.then((response) => {
					history.push(convertUrl(location.pathname, 'display'));
				}).catch(err => {
					console.log(err);
				});
		}
	}
	validateBookingSubmit(): boolean {
		let validateResult: boolean = false;
		const {
			Booking: { Source, Destination, DateTime, SeatsRequired },
		} = this.state;
		if (Source.length == 0) {
			validateResult = true;
			this.setState({ FormMsg: 'Please Enter Source' });
		} else this.setState({ FormMsg: '' });

		if (Destination.length == 0) {
			validateResult = true;
			this.setState({ ToMsg: 'Please Enter Destination' });
		} else this.setState({ ToMsg: '' });

		if (DateTime == null) {
			validateResult = true;
			this.setState({ DateMsg: 'Please Enter Valid Date' });
		} else this.setState({ DateMsg: '' });

		if (SeatsRequired == 0) {
			validateResult = true;
			this.setState({ SeatsMsg: 'Number of Seats To Book' });
		} else this.setState({ SeatsMsg: '' });
		return validateResult;
	}

	async onBookingSubmit(event) {
		event.preventDefault();
		if (!this.validateBookingSubmit()) {
			const {
				Booking: { Source, Destination, SeatsRequired },
			} = this.state;
			var SourceLocation: ILocation = new Location();
			var DestinationLocation: ILocation = new Location();
			var data = {
				countryRegion: 'IN',
				addressLine: '',
				key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
			};
			await axios
				.get('http://dev.virtualearth.net/REST/v1/Locations', {
					params: { ...data, addressLine: Source },
				})
				.then((response) => {
					var point = response.data.resourceSets[0].resources[0].point;
					SourceLocation.Lattitude = point.coordinates[0];
					SourceLocation.Longitude = point.coordinates[1];
					SourceLocation.LocationName = Source;

				})
				.catch((error) => {
					console.log(error);
				}),
				await axios
					.get('http://dev.virtualearth.net/REST/v1/Locations', {
						params: { ...data, addressLine: Destination },
					})
					.then((response) => {
						var point = response.data.resourceSets[0].resources[0].point;
						DestinationLocation.Lattitude = point.coordinates[0];
						DestinationLocation.Longitude = point.coordinates[1];
						DestinationLocation.LocationName = Destination;
					})
					.catch((error) => {
						console.log(error);
					})
			var parameter = {
				Source: SourceLocation,
				Destination: DestinationLocation,
				SeatsRequired: SeatsRequired,
			};
			axios.get(APIServer + 'Offerring/GetByEndPoints', { params: { form: JSON.stringify(parameter) }, headers: { 'Content-Type': 'application/json' } }).then((response) => {
				debugger;
				this.setState({ matchOffer: response.data });
			}).catch(err => {
				console.log(err);
			});
		}
	}

	// async onFromInput(event) {
	// 	const { value } = event.target;
	// 	this.setState({ from: value });

	// 	const lat = '22.7163528';
	// 	const long = '75.8278007';
	// 	const confidence_radius = '100000';
	// 	var params = {
	// 		query: value,
	// 		maxResults: '10',
	// 		userCircularMapView: lat + ',' + long + ',' + confidence_radius,
	// 		includeEntityTypes: 'Address',
	// 		userRegion: 'IN',
	// 		countryFilter: 'IN',
	// 		key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
	// 	};
	// 	const response = await axios.get('http://dev.virtualearth.net/REST/v1/Autosuggest', { params });

	// 	var addresses = response.data.resourceSets[0].resources[0].value.map((e) => e.address);
	// 	this.setState({ FromResult: addresses });
	// 	if (value.length == 0) this.setState({ FromResult: null });

	//  var data = {
	//    query:response.data.resourceSets[0].resources[0].value[0].address.formattedAddress,
	//    ...response.data.resourceSets[0].resources[0].value[0].address,
	//     countryRegion:'IN',
	//    key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
	//    maxResults:'1'
	//  };

	//  const res = await axios.get('http://dev.virtualearth.net/REST/v1/Locations', { params: { ...data } });

	//  console.log(res);
	//  response.data.resourceSets[0].resources[0].point.coordinates;
	//	}

	displayOfferRightPanel(event) {
		event.preventDefault();
		this.setState((state) => {
			return { ShowOfferForm: !state.ShowOfferForm };
		});
	}
	async onInputChange(event) {
		const { Toogle } = this.state;
		const { name, value } = event.target;

		if (Toogle) {
			this.setState((state) => {
				return {
					Booking: { ...state.Booking, [name]: value },
				};
			});
		} else {
			if (name == 'NumberPlate') {
				this.setState((state) => {
					return {
						Offer: { ...state.Offer, Vehicle: { ...state.Offer.Vehicle, [name]: value } },
					};
				});
			} else
				this.setState((state) => {
					return {
						Offer: { ...state.Offer, [name]: value },
					};
				});
		}
		if (name == 'Source' || name == 'Destination') {
			if (value.length == 0 && name == 'Destination') {
				this.setState({ ToResult: <></> });
				return;
			}
			if (value.length == 0 && name == 'Source') {
				this.setState({ FromResult: <></> });
				return;
			}

			const lat = '22.7163528';
			const long = '75.8278007';
			const confidence_radius = '100000';
			var parameters = {
				query: value,
				maxResults: '10',
				userCircularMapView: lat + ',' + long + ',' + confidence_radius,
				includeEntityTypes: 'Address',
				userRegion: 'IN',
				countryFilter: 'IN',
				key: 'Aq2eQ5lQBt_m1lBEQ5bFbFnP1b27g27lNGxqFCt_gtpXtmoSsEXVWw7aYfUh_Cvf',
			};

			const response = await axios.get('http://dev.virtualearth.net/REST/v1/Autosuggest', {
				params: parameters,
			});

			if (name == 'Source') {
				var addresses = response.data.resourceSets[0].resources[0].value.map((e, index) => (
					<span data-index={index} data-context='Source' key={index} onClick={this.handleAddressSelect}>
						{e.address.addressLine}
					</span>
				));

				this.setState({ FromResult: <>{addresses}</> });
			} else {
				var addresses = response.data.resourceSets[0].resources[0].value.map((e, index) => (
					<span
						data-index={index}
						key={index}
						data-context='Destination'
						onClick={this.handleAddressSelect}
					>
						{e.address.addressLine}
					</span>
				));
				this.setState({ ToResult: <>{addresses}</> });
			}
		}
	}
	handleSelection(event) {
		const { value } = event.target;
		this.setState((state) => {
			return {
				Offer: {
					...state.Offer,
					Vehicle: { ...state.Offer.Vehicle, Capacity: VehicleType[value], Type: value },
				},
			};
		});
	}

	render() {
		const { Offer: offer, IsOnUpdate: isOnUpdate } = this.state;
		const {
			ViaPointMsg,
			FormMsg,
			ToMsg,
			PriceMsg,
			TimeMsg,
			ShowOfferForm: showOfferForm,
			ShouldValidate: shouldValidate,
			Toogle,
			DateMsg: dateMsg,
			IsSlideRight: isSlideRight,
			ShowRides: showRides,
			FromResult: fromResult,
			ViaPointResult,
			ToResult: toResult,
			Booking,
			Offer,
			Offer: { ViaPoints },
			VehicleInfoMsg,
			Offer: {
				Vehicle: { Capacity },
			},
			SeatsMsg,
			matchOffer,
		} = this.state;
		var totalSeat = [];
		for (let i = 0; i < Capacity; i++) {
			totalSeat.push(' ');
		}
       const {match:{params:{bookingId}}} = this.props;
		return (
			<div className='ride' key={1}>
				<form className={'rideForm '.concat(Toogle ? 'formWidthLess' : 'formWidthMore')}>
					<div className='rideContent' key={1}>
						<div id='rideHead'>
							<div id='top'>
								<h1>{Toogle ? 'Book a Ride' : 'Offer a Ride'}</h1>
								<input type='checkbox' checked={isSlideRight} onChange={this.handleSlider} disabled={bookingId!=undefined?true:false}/>
							</div>
							<p>we get you the matches asap!</p>
						</div>
						<div id='rideFormBar'>
							<div className='rideFormcontent positionRelative'>
								<label>
									From <span className='msg'>{FormMsg}</span>
								</label>
								<input
									type='text'
									name='Source'
									required
									autoComplete='off'
									placeholder=' '
									id='from'
									disabled={bookingId!=undefined?(Booking.BookingStatus==2?true:false):false}
									value={Toogle ? Booking.Source : Offer.Source}
									onChange={this.onInputChange}
								/>
								<section className='suggestionResult'>{fromResult}</section>
							</div>
							<div className='rideFormcontent positionRelative'>
								<label>
									To <span className='msg'>{ToMsg}</span>
								</label>{' '}
								<input
									type='text'
									name='Destination'
									required
									id='to'
									placeholder=' '
									
									autoComplete='off'
									value={Toogle ? Booking.Destination : Offer.Destination}
									onChange={this.onInputChange}
								/>
								<section className='suggestionResult'>{toResult}</section>
							</div>
							<div className='rideFormcontent'>
								<label>
									Time <span className='msg'>{dateMsg}</span>
									<div className='DateTimePicker'>
										{' '}
										<DateTimePicker
											hourPlaceholder='HH'
											minutePlaceholder='MM'
											className='dateTime'
											disabled={bookingId != undefined ? (Booking.BookingStatus == 2 ? true : false) : false}
											value={Toogle ? Booking.DateTime : Offer.StartTime}
											onChange={(date) => {
												if (Toogle)
													this.setState((state) => {
														return {
															Booking: { ...state.Booking, DateTime: date },
														};
													});
												else {
													this.setState((state) => {
														return {
															Offer: { ...state.Offer, StartTime: date },
														};
													});
												}
											}}
										/>
									</div>
								</label>
							</div>
							{Toogle ? (
								<>
									<div className='rideFormcontent'>
										<label>
											Seats Required : <span className='msg'>{SeatsMsg}</span>
										</label>
										<input
											type='text'
											name='SeatsRequired'
											disabled={bookingId != undefined ? (Booking.BookingStatus == 2 ? true : false) : false}
											value={Booking.SeatsRequired == 0 ? '' : Booking.SeatsRequired}
											placeholder=' '
											onChange={this.onInputChange}
										/>
									</div>

									<button type='button' className='submit-button' onClick={this.onBookingSubmit}>
										Submit
									</button>
								</>
							) : (
									<div className="rideFormContent">
									<select name="Discount">
											<option value={0} selected={Offer.Discount==0?true:false} onClick={()=>{this.setState((state)=>{return {Offer:{...state.Offer,Discount:0}}})}}>ZERO</option>
											<option value={5} selected={Offer.Discount == 5 ? true : false} onClick={() => { this.setState((state) => { return { Offer: { ...state.Offer, Discount: 5 } } }) }}>FIVE</option>
											<option value={10} selected={Offer.Discount == 10 ? true : false} onClick={() => { this.setState((state) => { return { Offer: { ...state.Offer, Discount: 10 } } }) }}>TEN</option>
											<option value={20} selected={Offer.Discount == 20 ? true : false} onClick={() => { this.setState((state) => { return { Offer: { ...state.Offer, Discount: 20 } } }) }}>TWENTY</option>
									</select>
									</div>
								)}
						</div>
						{Toogle ? (
							''
						) : (
								<button id='next' onClick={this.displayOfferRightPanel}>
									Next>>
							</button>
							)}
					</div>

					{showOfferForm ? (
						<>
							<div className='rideFormContinue' key={2}>
								<div id='rideHead' key={1}>
									<div id='top' key={1}>
										<h1>{'Offer a Ride'}</h1>
										<input type='checkbox' checked={Toogle} onClick={this.handleSlider} />
									</div>
									<p>we get you the matches asap!</p>
								</div>
								<div id='viapoints' key={2}>
									<div key={0} className='stops'>
										<label>
											Stop {1}{' '}
											<span className='msg'>
												{shouldValidate ? (ViaPoints[0].length == 0 ? ViaPointMsg : '') : ''}
											</span>
										</label>
										<input
											type='text'
											placeholder=' '
											autoComplete='off'
											className='extras'
											required
											name={'_0'}
											value={ViaPoints[0] || ''}
											onChange={this.onViaPointInput}
										/>
										<section className='suggestionResult'>{ViaPointResult[0]}</section>
									</div>
									{ViaPoints.map((currentValue, index) => {
										if (index == 0) return <></>;
										return (
											<div key={index} className='stops'>
												<label className='minus' onClick={this.removeStop}>
													<i className='fa fa-times' data-key={index + ''}></i>
												</label>
												<label>
													Stop {index + 1}{' '}
													<span className='msg'>
														{shouldValidate ? (ViaPoints[index].length == 0 ? ViaPointMsg : '') : ''}
													</span>
												</label>
												<input
													type='text'
													placeholder=' '
													className='extras'
													autoComplete='off'
													required
													name={'_' + index}
													value={currentValue || ''}
													onChange={this.onViaPointInput}
												/>
												<section className='suggestionResult'>{ViaPointResult[index]}</section>
											</div>
										);
									})}
								</div>
								<label className='plus' onClick={this.AddMoreStops}>
									<i className='fa fa-plus'></i>
								</label>
								<div className='rideFormcontent VehicleInfo'>
									<label>
										Vehicle Information <span className='msg'>{VehicleInfoMsg}</span>
									</label>
									<p>
										<span>
											<input
												type='text'
												placeholder='Number Plate'
												name='NumberPlate'
												value={Offer.Vehicle.NumberPlate || ''}
												onChange={this.onInputChange}
											/>
										</span>
										<span>
											<select name='VehicleType' onChange={this.handleSelection}>
												{Object.keys(VehicleType).map((e) => (
													<option value={e}>{e}</option>
												))}
											</select>
										</span>
									</p>
								</div>
								<div id='sectionB'>
									<label>
										Available Seats <span className='msg'>{SeatsMsg}</span>{' '}
									</label>
									<div className='seats'>
										{totalSeat.map((e, index) => {
											return (
												<div>
													<input
														type='radio'
														value={index + 1}
														name='seats'
														onClick={() =>
															this.setState((state) => {
																return { Offer: { ...Offer, MaxOfferSeats: index + 1 } };
															})
														}
														checked={Offer.MaxOfferSeats == index + 1 ? true : false}
													/>
													<label>{index + 1}</label>
												</div>
											);
										})}
									</div>
								</div>
								<div id='offerPrice'>
									<label>
										Price <span className='msg'>{PriceMsg}</span>
									</label>
									<input
										type='text'
										name='PricePerKM'
										value={Offer.PricePerKM == 0 ? '' : Offer.PricePerKM}
										required
										onChange={this.onInputChange}
										placeholder='Enter Ride Price'
									/>
								</div>
								<br />
								<button
									type='submit'
									form='rideForm'
									className='submit-button'
									onClick={this.onOfferSubmit}
								>
									Submit
								</button>
							</div>
						</>
					) : (
							<></>
						)}
				</form>
				{<Matches offers={matchOffer} book={matchOffer == null ? null : Booking} />}
			</div>
		);
	}
}

export default withRouter(Ride);
