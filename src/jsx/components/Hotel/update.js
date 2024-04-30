import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Modal } from "react-bootstrap";
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { getLanguages } from '../../../handeApisMethods/languages';
import { getFeatures } from '../../../handeApisMethods/feature'
import { updateHotel } from '../../../handeApisMethods/hotel';
import { useParams } from 'react-router-dom';
import { getTour } from "../../../handeApisMethods/tours";
import { getHotel } from '../../../handeApisMethods/hotel';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from "@react-google-maps/api";
import Loader from '../spinerLoader/loader';
// import React, { useState } from 'react';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { url } from "../../../handeApisMethods/a-MainVariables";
import { getDestinations } from "../../../handeApisMethods/destinations";

const mapContainerStyle = {

    height: "500px",
  
    width: "100%",
    borderRadius: 10
  
};
  
  
const libraries = ["places"];

const UpdateHotel = () => {
    const [center, setCenter] = useState({
    
        lat: 40.712776,
    
        lng: -74.005974,
    
    })
    let { id } = useParams();
    const [largeModal, setLargeModal] = useState(false);
    const [showPageInput, setShowPageInput] = useState(false)
    const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedFeature, setSelectedFeature] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [selectedLanguage_reason, setSelectedLanguage_reason] = useState('');
    const [selectedLanguageName_reason, setSelectedLanguageName_reason] = useState('');
    const [names, setNames] = useState({})
    const [names_reason, setNames_reason] = useState({})
    const [descriptions, setDescriptions] = useState({})
    const [descriptions_reason, setDescriptions_reason] = useState({})
    const [slogans, setSlogans] = useState({})
    const [phone, setPhone] = useState('')
    const [addresses, setAddresses] = useState('')
    const [check_in, setCheck_in] = useState('')
    const [check_out, setCheck_out] = useState('')
    const [map, setMap] = useState('')
    const [icon_path, setIcon_path] = useState(null)
    const [features, setFeatures] = useState([])
    const [tourId, setTourId] = useState(null)

    const [hotelReasons, setHotelReasons] = useState([]);
    const [hotelOldReasons, setHotelOldReasons] = useState([]);
    const [hotelFeatures, setHotelFeatures] = useState([]);
    const [oldGallery, setOldGallery] = useState([]);
    const [hotelTours, setHotelTours] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isGoogle] = useState(window.google)

    const [address, setAddress] = useState(null)
    const [addressName, setAddressName] = useState(null)
    const [lng, setLng]  = useState(null)
    const [lat, setLat]  = useState(null)
    const [type, setType] = useState("Hotel")

    const [selectedPlace, setSelectedPlace] = useState(null);
  
    const autocompleteRef = useRef(null);
    const [hotel_destination, sethotel_destination] = useState(null)
    const [destinations, setDestinations] = useState([])
    const handleChangeHotelDestination = (event) => {
        sethotel_destination(event.target.value)
    }

    const onLoad = (autocomplete) => {

        autocompleteRef.current = autocomplete;
    
      };
    
    
      const onPlaceChanged = () => {
    
        if (autocompleteRef.current !== null) {
    
          const place = autocompleteRef.current.getPlace();
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const newCenter = { lat, lng };
          setCenter(newCenter);
          setSelectedPlace(place);
    
        }
    
      };
      useEffect(() => {
        if (selectedPlace) {
          setAddress(selectedPlace.formatted_address)
          setAddressName(selectedPlace.name)
          setLat(selectedPlace.geometry.location.lat())
          setLng(selectedPlace.geometry.location.lng())
        }
      }, [selectedPlace]);          


    const handleFileUpload = (event) => {
        const files = event.target.files;
        setSelectedFiles([...selectedFiles, ...files]); // Update selected files

        const temporaryPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...temporaryPreviews]);
        console.log(previewImages);
    };

    const notifyError = (err) => {
        toast.error("❌ " + err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    const notifyTopRight = (msg) => {
        toast.success("✔️ " + msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleChangeLang = (e) => {
        const value = e.target.value;
        setSelectedLanguage(value);
        setNames((prevState) => ({
            ...prevState,
            [value]: names[value] ? names[value] : "",
        }));
        setDescriptions((prevState) => ({
            ...prevState,
            [value]: descriptions[value] ? descriptions[value] : "",
        }));
        // setSlogans((prevState) => ({
        //     ...prevState,
        //     [value]: slogans[value] ? slogans[value] : "",
        //   }));
        setAddresses((prevState) => ({
            ...prevState,
            [value]: addresses[value] ? addresses[value] : "",
        }));
    };

    const handleChangeFeatures = (e) => {
        const value = e.target.value;
        setSelectedFeature(value);
    };

    const handleChangeLang_reason = (e) => {
        const value = e.target.value;
        setSelectedLanguage_reason(value);
        setNames_reason((prevState) => ({
            ...prevState,
            [value]: names_reason[value] ? names_reason[value] : "",
        }));
        setDescriptions_reason((prevState) => ({
            ...prevState,
            [value]: descriptions_reason[value] ? descriptions_reason[value] : "",
        }));
    };
    const handleChangeType = (e) => {
        const value = e.target.value;
        setType(value);
      };

    const handelAddReason = () => {
        let isErrors = false
        languages.map(lang => {
            if (!names_reason[lang.key]) {
                notifyError("Please enter reason name in " + lang.name)
                isErrors = true;
            }
            if (!descriptions_reason[lang.key]) {
                notifyError("Please enter reason Description in " + lang.name)
                isErrors = true;
            }
        })

        if (!icon_path) {
            notifyError("Please upload reason png icon ")
            isErrors = true;
        }

        if (!isErrors) {
            let reasons = hotelReasons;
            reasons.push(
                {
                    names: names_reason,
                    descriptions: descriptions_reason,
                    thumbnail: icon_path
                }
            )
            setHotelReasons(reasons)
            setLargeModal(false)
            setNames_reason({})
            setDescriptions_reason({})
            setIcon_path({})
        }
    }

    const handleChooseFeature = () => {
        if (hotelFeatures.find(feature => feature.id == selectedFeature)) {
            notifyError("Feature already added")
        } else {
            setHotelFeatures((prevState) => ([
                ...prevState,
                features.find(feature => feature.id == selectedFeature)
            ]));
        }
    }

    const handleCHangeIcon = (event) => {
        const file = event.target.files[0];
        setIcon_path(file);
    };

    const handleSetPhone = (event) => {
        setPhone(event.target.value);
    };
    const handleSetCheck_in = (event) => {
        setCheck_in(event.target.value);
    };
    const handleSetCheck_out = (event) => {
        setCheck_out(event.target.value);
    };
    const handleSetMap = (event) => {
        setMap(event.target.value);
    };
    const handleChangeName = (event) => {
        setNames((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
        console.log(names);
    };

    const handleChangeName_reason = (event) => {
        setNames_reason((prevState) => ({
            ...prevState,
            [selectedLanguage_reason]: event.target.value,
        }));
    };

    const handleChangeDescription = (event) => {
        setDescriptions((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeDescription_reason = (event) => {
        setDescriptions_reason((prevState) => ({
            ...prevState,
            [selectedLanguage_reason]: event.target.value,
        }));
    };

    const handleChangeSlogan = (event) => {
        setSlogans((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeAddress = (event) => {
        setAddresses((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };
    const removeHotelOldReason = (indexToRemove) => {
        setHotelOldReasons(prevHotelOldReasons => prevHotelOldReasons.filter((_, index) => index !== indexToRemove));
    }

    const removeHotelReason = (indexToRemove) => {
        setHotelReasons(prev => prev.filter((_, index) => index !== indexToRemove));
    }


    const removeFeature = (indexToRemove) => {
        setHotelFeatures(prevHotelFeatures => prevHotelFeatures.filter((_, index) => index !== indexToRemove));
    }

    const removeOldGallery = (indexToRemove) => {
        console.log(oldGallery);
        setOldGallery(prevOldGallery => prevOldGallery.filter((_, index) => index !== indexToRemove));
    }
    const removePreviewImgs = (indexToRemove) => {
        setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    }
    const handleAddTourToHotel = (event) => {
        setTourId(event.target.value)
    }

    const handleAddTour = () => {
        getTour(tourId).then(res => {
            if (res.data) {
                if (hotelTours.length > 0 && hotelTours.find(tour => tour.id == tourId)) {
                    notifyError("Tour already added")
                }else{
                    setHotelTours((prevState) => ([
                        ...prevState,
                        res.data
                    ]));
                }        
            } else {
                notifyError("Invalid id")
            }
        })
    }

    const handleRemoveTour = (indexToRemove) => {
        setHotelTours(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const handleUpdateHotel = () => {
        updateHotel(id, oldGallery, hotelOldReasons, names, slogans ? slogans : [], descriptions, addresses, phone, selectedFiles, address, addressName, lat, lng, check_in, check_out, hotelFeatures, hotelReasons, hotelTours, type, hotel_destination)
            .then(res => {
                if (res.data.status === true) {
                    notifyTopRight(res.data.message)
                    setTimeout(() => {
                        window.location.href = "/Admin/Hotels"
                    }, 2000);
                } else {
                    notifyError(res.data.errors[0])
                }
            })
    }

    useEffect(() => {
        getLanguages().then(res => {
            setLanguages(res.data)
            setSelectedLanguage(res.data[0].key)
            setSelectedLanguage_reason(res.data[0].key)
            getFeatures().then(fet => {
                setFeatures(fet.data)
                setSelectedFeature(fet.data[0].id)
                setShowPageInput(true)
            })
        })
        getDestinations().then(res => {
            setDestinations(res.data)
        })
    }, []);

    useEffect(() => {
        if (languages && languages.length && selectedLanguage) {
            const language = languages.find(language => language.key === selectedLanguage);
            if (language) {
                setSelectedLanguageName(language.name);
            }
        }
    }, [languages, selectedLanguage]);

    useEffect(() => {
        if (languages && languages.length && features && features.length)
            getHotel(id).then(async res => {
                res.data.names.map(name => {
                    let langKey = languages.find(language => language.id == name.language_id).key
                    setNames((prevState) => ({
                        ...prevState,
                        [langKey]: name.name,
                    }));
                })
                res.data.descriptions.map(description => {
                    let langKey = languages.find(language => language.id == description.language_id).key
                    setDescriptions((prevState) => ({
                        ...prevState,
                        [langKey]: description.description,
                    }));
                })
                res.data.addresses.map(address => {
                    let langKey = languages.find(language => language.id == address.language_id).key
                    setAddresses((prevState) => ({
                        ...prevState,
                        [langKey]: address.address,
                    }));
                })
                res.data.slogans.map(slogan => {
                    let langKey = languages.find(language => language.id == slogan.language_id).key
                    setSlogans((prevState) => ({
                        ...prevState,
                        [langKey]: slogan.slogan,
                    }));
                })
                setPhone(res.data.phone)
                setMap(res.data.map)
                setCheck_in(res.data.check_in)
                setCheck_out(res.data.check_out)

                let fs = []
                res.data.features.map(fet => {
                    fs.push(features.find(ff => ff.id == fet.pivot.feature_id))
                })
                setHotelFeatures(fs)

                setHotelOldReasons(res.data.reasons)
                sethotel_destination(res.data.destination_id)
                setOldGallery(res.data.gallery)
                let lat = res.data.lat
                let lng = res.data.lng
                const newCenter = { lat, lng };
                setCenter(newCenter);
                setLat(res.data.lat);
                setLng(res.data.lng);
                setAddress(res.data.address);
                setType(res.data.type);
                setHotelTours(res.data.tours);        
                setAddressName(res.data.address_name);        
            })
    }, [features, languages])
    useEffect(() => {
        if (languages && languages.length && selectedLanguage_reason) {
            const language = languages.find(language => language.key === selectedLanguage_reason);
            if (language) {
                setSelectedLanguageName_reason(language.name);
            }
        }
    }, [languages, selectedLanguage_reason]);

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <ToastContainer>
                    </ToastContainer>
                    <div className="row">
                        {
                            showPageInput && (
                                <>
                                    <h2 className="mb-4">Set Hotel data in ({selectedLanguageName})</h2>
                                    <div className="d-flex gap-3">
                                        <div className="w-50 form-group">
                                            <label for="names">Hotel Name in ({selectedLanguageName})*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="names"
                                                placeholder="Hotel Name"
                                                value={names[selectedLanguage]}
                                                onChange={handleChangeName} />
                                        </div>
                                        <div className="w-25 form-group">
                                            <label for="destination" >Destination</label>
                                            <select id="destination" className="form-control" value={hotel_destination} onChange={handleChangeHotelDestination}>
                                            <option value={null} selected>select ---</option>
                                            {destinations.map((des, index) => (
                                                <option key={index} value={des.id}>
                                                    {des.name_en}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
                                        <div className="w-25 form-group">
                                            <label for="languages" >Languages</label>
                                            <select id="languages" className="form-control" value={selectedLanguage} onChange={handleChangeLang}>
                                                {languages.map((lang, index) => (
                                                    <option key={index} value={lang.key}>
                                                        {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="form-group">
                                            <label for="description">Description in ({selectedLanguageName})*</label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                id="description"
                                                placeholder="Hotel Description"
                                                value={descriptions[selectedLanguage]}
                                                onChange={handleChangeDescription} style={{ resize: "none", paddingTop: 10 }} rows={5}>
                                            </textarea>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mt-3">
                                        <div className="w-50 form-group">
                                            <label for="slogan">Hotel Slogan or Brief in ({selectedLanguageName})</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="slogan"
                                                placeholder="Hotel Slogan"
                                                value={slogans[selectedLanguage]}
                                                onChange={handleChangeSlogan} />
                                        </div>
                                        <div className="w-50 form-group">
                                            <label for="phone">Hosting Number*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
                                                placeholder="Hotel Hosting Phone"
                                                value={phone}
                                                onChange={handleSetPhone} />
                                        </div>
                                        <div className="w-50 form-group">
                                            <label for="type">Hotel Type*</label>
                                            <select name="type" id="type" className="form-control" value={type} onChange={handleChangeType}>
                                                <option value="Hotel">Hotel</option>
                                                <option value="Cottage">Cottage</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="form-group">
                                            <label for="addresses">Address in ({selectedLanguageName})*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="addresses"
                                                placeholder="Hotel Address"
                                                value={addresses[selectedLanguage]}
                                                onChange={handleChangeAddress} />
                                        </div>
                                    </div>
                                    <div className="pl-2 pr-2">
                                        {
                                        address && (
                                            <div className='card mb-0 mt-3 p-3' style={{height: "max-content"}}>
                                            <h4>{addressName}</h4>
                                            <p className='mb-0'>{address}</p>
                                            </div>
                                        )
                                        }
                                        <div className='card mt-3 p-3'  style={{height: "max-content"}}>
                                        {
                                            isGoogle == undefined && (
                                            <LoadScript googleMapsApiKey="AIzaSyBzXxR0ge7r2dT4BIVCl9uSLHKT9em6wzQ" libraries={libraries}>
                                                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                                <input type="text" placeholder="Enter a location" className="w-100 form-control mb-2" />
                                                </Autocomplete>

                                                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} style={{width: "100%"}}>
                                                {selectedPlace && (
                                                    <>
                                                    <Marker position={selectedPlace.geometry.location} />
                                                    </>
                                                )}
                                                </GoogleMap>
                                            </LoadScript>
                                            )
                                        }
                                        {
                                            isGoogle && (
                                            <>
                                                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                                <input type="text" placeholder="Enter a location" className="w-100 form-control mb-2" />
                                                </Autocomplete>

                                                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} style={{width: "100%"}}>
                                                {selectedPlace && (
                                                    <>
                                                    <Marker position={selectedPlace.geometry.location} />
                                                    </>
                                                )}
                                                </GoogleMap>
                                            </>
                                            )
                                        }
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mt-3">
                                        <div className="w-50 form-group">
                                            <label for="check_in">Hotel Check In*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="check_in"
                                                placeholder="Hotel Check In"
                                                value={check_in}
                                                onChange={handleSetCheck_in} />
                                        </div>
                                        <div className="w-50 form-group">
                                            <label for="check_in">Hotel Check Out*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="check_out"
                                                placeholder="Hotel Check Out"
                                                value={check_out}
                                                onChange={handleSetCheck_out} />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mt-3">

                                        <div className="w-50">
                                            <div className="d-flex gap-2 justify-content-between form-group" style={{ marginTop: 32 }}>
                                                <h3>Reasons to choose hotel</h3>
                                                <button className="btn btn-sm btn-success" onClick={() => setLargeModal(true)}>Add Reason</button>
                                            </div>
                                            {hotelOldReasons.map((item, index) => (
                                                <div className="d-flex gap-2 mt-3" dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
                                                    <img style={{ width: 40, height: 40, objectFit: "contain" }} src={url + item.icon_path} />
                                                    <div>
                                                        <h4 className="m-0">
                                                            {item.names.find(name => name.language_id == languages.find(language => language.key == selectedLanguage).id).name}
                                                            <button onClick={() => removeHotelOldReason(index)} style={{ background: "transparent", border: "none", borderRadius: "50%", float: "right" }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#043343" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M18 6l-12 12" />
                                                                    <path d="M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </h4>
                                                        <p className="pr-3" style={{ lineHeight: "19px", marginTop: "5px" }}>{item.descriptions.find(description => description.language_id == languages.find(language => language.key == selectedLanguage).id).description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {hotelReasons.map((item, index) => (
                                                <div className="d-flex gap-2 mt-3" dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
                                                    <img style={{ width: 40, height: 40, objectFit: "contain" }} src={URL.createObjectURL(item.thumbnail)} />
                                                    <div className="w-100">
                                                        <h4 className="m-0 w-100">{item.names[selectedLanguage]}
                                                            <button onClick={() => removeHotelReason(index)} style={{ background: "transparent", border: "none", borderRadius: "50%", float: "right" }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#043343" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M18 6l-12 12" />
                                                                    <path d="M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </h4>
                                                        <p className="pr-3" style={{ lineHeight: "19px", marginTop: "5px" }}>{item.descriptions[selectedLanguage]}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-50">
                                            <div className="form-group">
                                                <label for="features">Choose Features*</label>
                                                <div className="d-flex gap-2">
                                                    <select id="features" className="form-control" value={selectedFeature} onChange={handleChangeFeatures}>
                                                    {
                                                            (features && features.length) && (
                                                                features.map((feature, index) => (
                                                                    <option key={index} value={feature.id}>
                                                                    {
                                                                        feature.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name
                                                                    }
                                                                    </option>
                                                                ))
                                                            )
                                                        }
                                                    </select>
                                                    <button className="btn btn-success" onClick={handleChooseFeature}>Choose</button>
                                                    <button className="btn btn-primary" onClick={() => getFeatures().then(res => { setFeatures(res.data) })}>Reload</button>
                                                </div>
                                                <div className="card  mt-3">
                                                    {hotelFeatures.map((item, index) => (
                                                        <div className="d-flex gap-2 m-2 align-items-center" key={item.id} dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
                                                            <img style={{ width: 40, height: 40, objectFit: "contain" }} src={url + item.icon_path} />
                                                            <div className="w-100">
                                                                <h3 className="m-0 w-100">
                                                                    {item.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name}
                                                                    <button onClick={() => removeFeature(index)} style={{ background: "transparent", border: "none", borderRadius: "50%", float: "right" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#043343" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                            <path d="M18 6l-12 12" />
                                                                            <path d="M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 mt-3">
                                        <div className="w-100 form-group">
                                            <label for="gallary" className="form-control" style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '140px',
                                                fontSize: '22px',
                                            }}>
                                                {
                                                    previewImages.length > 0 ? (
                                                        "Add Images to gallery"
                                                    ) : (
                                                        "Upload Hotel Gallary*"
                                                    )
                                                }
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo-plus" width="55" height="55" viewBox="0 0 24 24" stroke-width="2" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M15 8h.01" />
                                                    <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                                                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                                                    <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                                                    <path d="M16 19h6" />
                                                    <path d="M19 16v6" />
                                                </svg>
                                            </label>
                                            <input type="file" id="gallary" multiple className="form-control" onChange={handleFileUpload} style={{ display: "none" }} />
                                        </div>
                                    </div>
                                    <div id="preview-gallery" className="mt-3">
                                            <div
                                                className="row"
                                                // onInit={() => console.log('LightGallery initialized')}
                                                // speed={500}
                                                // // plugins={[lgThumbnail]}
                                                // elementClassNames="row"
                                                >
                                            {oldGallery.length > 0 && 
                                                oldGallery.map((item, index) => (
                                                    <div data-src={url + item.path} className="col-lg-3 col-md-6 mb-4" key={index}>
                                                        <button onClick={() => removeOldGallery(index)} style={{ background: "transparent", border: "none", borderRadius: "50%", float: "right" }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#043343" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M18 6l-12 12" />
                                                                <path d="M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <img src={url + item.path} style={{ width: "100%", height: 250, objectFit: 'cover' }} alt="gallery" className='cursor-pointer' />
                                                    </div>
                                                ))
                                                }
                                                {previewImages.length > 0 &&
                                                    previewImages.map((item, index) => (
                                                        <div data-src={item} className="col-lg-3 col-md-6 mb-4" key={index}>
                                                            <button onClick={() => removePreviewImgs(index)} style={{ background: "transparent", border: "none", borderRadius: "50%", float: "right" }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#043343" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M18 6l-12 12" />
                                                                    <path d="M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                            <img src={item} style={{ width: "100%", height: 250, objectFit: 'cover' }} alt="gallery" className='cursor-pointer' />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    </div>
                                    <Modal
                                        className="fade bd-example-modal-lg"
                                        show={largeModal}
                                        size="lg"
                                    >
                                        <Modal.Header>
                                            <Modal.Title>
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coins" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" />
                                                    <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
                                                    <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" />
                                                    <path d="M3 6v10c0 .888 .772 1.45 2 2" />
                                                    <path d="M3 11c0 .888 .772 1.45 2 2" />
                                                </svg>
                                                {
                                                    "Add New Reason"
                                                }

                                            </Modal.Title>
                                            <Button
                                                variant=""
                                                className="btn-close"
                                                onClick={() => setLargeModal(false)}
                                            >

                                            </Button>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div>
                                                <div class="form-group">
                                                    <label for="formFile" class="form-label">Reason png icon</label>
                                                    <input class="form-control" type="file" id="formFile"
                                                        onChange={handleCHangeIcon} />
                                                </div>
                                            </div>
                                            <div className="d-flex gap-3 mt-3">
                                                <div className="w-75 form-group">
                                                    <label for="names">Reason Title in ({selectedLanguageName_reason})*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="names"
                                                        placeholder="Reason title"
                                                        value={names_reason[selectedLanguage_reason]}
                                                        onChange={handleChangeName_reason} />
                                                </div>
                                                <div className="w-25 form-group">
                                                    <label for="languages" >Languages</label>
                                                    <select id="languages" className="form-control" value={selectedLanguage_reason} onChange={handleChangeLang_reason}>
                                                        {languages.map((lang, index) => (
                                                            <option key={index} value={lang.key}>
                                                                {lang.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="form-group">
                                                    <label for="description">Description in ({selectedLanguageName_reason})*</label>
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        id="description"
                                                        placeholder="Hotel Description"
                                                        value={descriptions_reason[selectedLanguage_reason]}
                                                        onChange={handleChangeDescription_reason} style={{ resize: "none", paddingTop: 10 }} rows={5}>
                                                    </textarea>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                variant="dark"
                                                onClick={() => setLargeModal(false)}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                variant=""
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => handelAddReason()}
                                            >
                                                Add
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <div className="d-flex gap-3 justify-content-between mb-3">
                                        <h3>Suggest Tours</h3> 
                                        <div className="d-flex w-50 gap-3">
                                            <input className="form-control w-50" placeholder="Tour #id" value={tourId} onChange={handleAddTourToHotel}/>
                                            <button className="btn btn-secondary w-50" onClick={handleAddTour}>Add</button>
                                        </div>
                                    </div>
                                    <div className="gap-3 mt-3 w-100" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                                        {
                                            (hotelTours && hotelTours.length > 0) && (
                                                hotelTours.map((tour, index) => (
                                                    <div className="card gap-3 p-3"  style={{display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative"}}>
                                                        <button onClick={() => handleRemoveTour(index)} className="btn btn-sm btn-danger p-2" style={{position: "absolute", top: 10, right: 10, height: 30}}>X</button>
                                                        <img src={url + tour.gallery[0].path} style={{width: "100%", borderRadius: 10}} />
                                                        <div>
                                                            <h3>{tour.titles[0].title}</h3>
                                                            <p className="m-0">{tour.intros[0].intro}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>
                                    <Button className="btn btn-primary w-25" style={{ margin: "auto" }} onClick={() => handleUpdateHotel()}>Update</Button>
                                </>
                            )
                        }
                        {
                            !showPageInput && (
                                <Loader />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateHotel;