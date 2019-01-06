import React, {
    Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Map,
    InfoWindow,
    Marker,
    GoogleApiWrapper
} from 'google-maps-react';
import Select from 'react-select';
import axios from 'axios';



let options = [];

class App extends Component {


    constructor(props) {
        super();
        this.state = {
            selectedOption: null,
            isLoaded: false,
            autocompleteSuggestion: [],
            lat: 48.407326,
            long: -123.329773,
           
        }

    }



    getCoordinate(address) {

        let url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDMQNXNqvLcdx4rEhOsSX5YCRyzCUAuDaI&address=' + address



        axios.get(url)
            .then(res => {


                if (res.data.results[0].geometry.location.lat != undefined) {

                    console.log(address)
                    console.log(res.data.results[0].geometry.location.lat)
                    console.log(res.data.results[0].geometry.location.lng)
                    this.setState({
                        lat: res.data.results[0].geometry.location.lat,
                        long: res.data.results[0].geometry.location.lng,
                    })


                }

            })


    }

    componentDidMount() {

        fetch('/api/')
            .then(res => res.json())
            .then(json => {
                var physician_names = []

                json.map(function(item, i) {
                    if (item.Physician_First_Name != "Physician_First_Name") {
                        let full_name = item.Physician_First_Name + " " + item.Physician_Middle_Name + " " + item.Physician_Last_Name
                        let address = item.Recipient_Primary_Business_Street_Address_Line1 + "," + item.Recipient_City + "," + item.Recipient_State + "," + item.Recipient_Zip_Code + "," + item.Recipient_Country

                        address = address.replace(/\s/g, '');

                        let obj = {
                            'value': full_name,
                            'label': full_name,
                            'address': address,
                            'id': i
                        }
                        physician_names.push(obj)
                    }
                })
                options = physician_names


                this.setState({
                    isLoaded: true,
                    response: json,
                    autocompleteSuggestion: physician_names,
                })
            })

    }


    handleChange = (selectedOption) => {
        this.getCoordinate(selectedOption.address)
        this.setState({
            selectedOption
        });
        //console.log(`Option selected:`, selectedOption);
    }
    render() {
        const {
            selectedOption,
            isLoaded,
            response,
            lat,
            long
        } = this.state;


        if (!isLoaded) {
            return ( 
                <div className = "App" >
                
                <header className = "App-header" >
                
                <img src = {
                    logo
                }
                className = "App-logo"
                alt = "logo" / >

                
                </header>

                
                </div>

            )
        } else
            return (

                
                <div>

            <Map google={ this.props.google }
                 zoom={ 14 } 
                 center={ { lat: lat, lng: long } }>

           <Marker onClick={ this.onMarkerClick } 
                   name={ 'Current location' } 
                   position={ { lat: lat, lng: long } } 
                   defaultAnimation={ this.props.google.maps.Animation.DROP } 
                   icon={ { url: "https://img.icons8.com/color/48/000000/medical-doctor.png", 
                   anchor: new this.props.google.maps.Point(32, 32), scaledSize: new this.props.google.maps.Size(64, 64) } } />

            </Map>

            <div className="container">

                <div id="contact">

                    <h3> Locate physician < /h3>

                <Select value = { selectedOption }
                        onChange = { this.handleChange }
                        options = { options }  />

                  </div> 
               </div>

            </div>


            )


    }


}




export default GoogleApiWrapper({
    apiKey: ("AIzaSyDMQNXNqvLcdx4rEhOsSX5YCRyzCUAuDaI")
})(App)