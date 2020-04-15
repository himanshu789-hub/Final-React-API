import * as React from 'react';
import axios from 'axios';
import { APIServer } from '../Connection/connection';
import { withRouter } from 'react-router';
import OfferCard from '../OfferCard/OfferCard';
import './css/OfferDetails.css';
interface IOfferDetails {
    history: any,
    location: any,
    match: any,
    IsOnSingleOffer:boolean;
}
interface IOfferState {
    Offer: any,
    IsSinglOffer:Boolean,
    nextLocation: string,
    Offers:Array<any>
}
class OfferDetails extends React.Component<IOfferDetails, IOfferState> {
    constructor(props: IOfferDetails) {
        super(props);
        const {IsOnSingleOffer}  = this.props;
        this.state = {
            Offer: null,
            IsSinglOffer:IsOnSingleOffer,
            nextLocation: '',
            Offers:null
        }
        this.handleNextStation = this.handleNextStation.bind(this);
        this.handleReach = this.handleReach.bind(this);
    }
componentWillReceiveProps(){
    const { IsOnSingleOffer } = this.props;
    const { offerId, id } = this.props.match.params;

    this.setState({IsSinglOffer:IsOnSingleOffer});

        debugger;
        if (IsOnSingleOffer) {
            axios.get(APIServer + 'Offerring/GetById', { params: { id: offerId } }).then(res => {
                this.setState({ Offer: res.data });
            });

            this.handleNextStation();
        }
        else {
            axios.get(APIServer + 'Offerring/GetByUserId', { params: { userId: id } }).then(res => {
                this.setState({ Offers: res.data });
            })
        }
    
}
    componentDidMount() {

        const { offerId,id } = this.props.match.params;
        const {IsOnSingleOffer} = this.props;
        if(IsOnSingleOffer)
       { axios.get(APIServer + 'Offerring/GetById', { params: {id:offerId} }).then(res => {
            this.setState({ Offer: res.data});
        });

            this.handleNextStation();
    }
        else{
            axios.get(APIServer+'Offerring/GetByUserId',{params:{userId:id}}).then(res=>{
                this.setState({ Offers: res.data}) ;
            })
        }
    }
    handleReach() {
        const { Offer, nextLocation } = this.state;
        const data = {
            OfferId: Offer.id,
            ReachedLocation: nextLocation
        }
        const str = new String(JSON.stringify(data));
        console.log(JSON.stringify(data));
        axios.put(APIServer + 'Offerring/updateLocation',str).then(res => {
            this.handleNextStation();
        });
    }
    handleNextStation() {
        const { offerId } = this.props.match.params;
        const data = {
            OfferId: offerId,
        }
        const str =  new String(JSON.stringify(data));
        console.log(JSON.stringify(data));
        axios.put(APIServer + 'Offerring/handleNextLocation', str).then(res => {
            const responseValue = res.data;
            debugger;
            if (responseValue == null||responseValue=="") {
                axios.get(APIServer + 'Offerring/getById', { params: { id: offerId } }).then(res => {
                    this.setState({ Offer: res.data });
                });
            }
            this.setState({ nextLocation: responseValue });
        });
    }
    render() {
        const { Offer, nextLocation,IsSinglOffer } = this.state;
        if(IsSinglOffer)
        return (
            <div className="OfferDetails">
                <table id="offers">
                    <thead><tr><th colSpan={3}>Offer Details</th></tr></thead>
                    <tbody>
                        <tr><td>Offer Id</td><td>:</td><td>{Offer == null ? '' : Offer.id}</td></tr>
                        <tr><td>Source</td><td>:</td><td>{Offer == null ? '' : Offer.source.locationName}</td></tr>
                        <tr><td>Destination</td><td>:</td><td>{Offer == null ? '' : Offer.destination.locationName}</td></tr>
                        <tr><td>Fare Price(/km)</td><td>:</td><td>{Offer == null ? '' : Offer.pricePerKM}</td></tr>
                        <tr><td>Your Current Location is </td><td>:</td><td>{Offer == null ? '' : Offer.currentLocation.locationName}</td></tr>
                        {nextLocation != null ? <tr><td>Did You Reach {nextLocation}</td><td>:</td><td><button className="buttonLocationUpdate" onClick={this.handleReach}><span>YES</span></button></td></tr> : <></>
                        }
                    </tbody>
                </table>
                {Offer == null ? '' : Offer.active == false ? <><p>You Have Reached Your Destination</p><p>Your Total Earning Is : {Offer.totalEarning}</p></> : <></>}
            </div>
        )
        else{        
            const {Offers} = this.state;    
        return <div className="offerList">{Offers!=null?Offers.map(e=><OfferCard offer={e} isOnUpdate={true}/>):''}</div>;
        }
    }

}
export default withRouter(OfferDetails);