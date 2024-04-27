import { getLanguages } from '../../../handeApisMethods/languages';
import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from "@react-google-maps/api";
import { Button, Modal } from "react-bootstrap";
import { createCar, getCar, updateCar } from '../../../handeApisMethods/cars';
import { ToastContainer, toast } from "react-toastify";
import Loader from '../spinerLoader/loader';
import { getFeatures } from '../../../handeApisMethods/carfeature'
import { url } from '../../../handeApisMethods/a-MainVariables';
import { getCurrencies } from '../../../handeApisMethods/currencies';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { useParams } from 'react-router-dom';

const mapContainerStyle = {

    height: "500px",

    width: "100%",
    borderRadius: 10

};


const libraries = ["places"];
const UpdateCar = () => {
    const [center, setCenter] = useState({

        lat: 40.712776,

        lng: -74.005974,

    })
    const [currencies, setCurrencies] = useState(null)
    const [selectedcurrency, setselectedcurrency] = useState('');
    const [selectedcurrencyName, setselectedcurrencyName] = useState('');

    const [oldGallery, setOldGallery] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const { id } = useParams()
    const [showPageInput, setShowPageInput] = useState(false)
    const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [showMinsingLangWarning, setShowMinsingLangWarning] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const [names, setNames] = useState({})
    const [descriptions, setDescriptions] = useState({})
    const [categories, setCategories] = useState({})
    const [phone, setPhone] = useState({})
    const [selectedFeature, setSelectedFeature] = useState('');
    const [features, setFeatures] = useState([])
    const [carFeatures, setCarFeatures] = useState([]);
    const [prices, setPrices] = useState({})

    const [isGoogle] = useState(window.google)

    const [address, setAddress] = useState(null)
    const [addressName, setAddressName] = useState(null)
    const [lng, setLng] = useState(null)
    const [lat, setLat] = useState(null)

    const [selectedPlace, setSelectedPlace] = useState(null);

    const autocompleteRef = useRef(null);
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
    const handleFileUpload = (event) => {
        const files = event.target.files;
        setSelectedFiles([...selectedFiles, ...files]); // Update selected files

        const temporaryPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...temporaryPreviews]);
        console.log(previewImages);
    };


    const handleChangeLang = (e) => {
        const value = e.target.value;
        setSelectedLanguage(value);
        setNames((prevState) => ({
            ...prevState,
            [value]: names[value] ? names[value] : "",
        }));
        setCategories((prevState) => ({
            ...prevState,
            [value]: categories[value] ? categories[value] : "",
        }));
        setDescriptions((prevState) => ({
            ...prevState,
            [value]: descriptions[value] ? descriptions[value] : "",
        }));
    };
    const handleChangeName = (event) => {
        setNames((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
        console.log(names);
    };


    const removeFeature = (indexToRemove) => {
        setCarFeatures(prevHotelFeatures => prevHotelFeatures.filter((_, index) => index !== indexToRemove));
    }

    const handleChangeDescription = (event) => {
        setDescriptions((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeCategories = (event) => {
        setCategories((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangePhone = (event) => {
        setPhone(event.target.value)
    };
    const handleChangeFeatures = (e) => {
        const value = e.target.value;
        setSelectedFeature(value);
    };
    const handleChangeCurrency = (e) => {
        const value = e.target.value;
        setselectedcurrency(value);
        const curr = currencies.find(curre => curre.id == e.target.value);
        setselectedcurrencyName(curr.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name)
        setPrices((prevState) => ({
            ...prevState,
            [value]: prices[value] ? prices[value] : "",
        }));
    };
    const handleChangePrices = (event) => {
        setPrices((prevState) => ({
            ...prevState,
            [selectedcurrency]: event.target.value,
        }));
        console.log(prices);
    };

    const handleChooseFeature = () => {
        if (carFeatures.find(feature => feature.id == selectedFeature)) {
            notifyError("Feature already added")
        } else {
            setCarFeatures((prevState) => ([
                ...prevState,
                features.find(feature => feature.id == selectedFeature)
            ]));
        }
    }

    const removeOldGallery = (indexToRemove) => {
        console.log(oldGallery);
        setOldGallery(prevOldGallery => prevOldGallery.filter((_, index) => index !== indexToRemove));
    }
    const removePreviewImgs = (indexToRemove) => {
        setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const handleUpdateCar = () => {
        setShowLoader(true)
        updateCar(id, names, categories, descriptions, address, addressName, lng, lat, prices, carFeatures, selectedFiles, phone, oldGallery).then(res => {
            setShowLoader(false)
            if (res.data.status === true) {
                notifyTopRight(res.data.message)
                setTimeout(() => {
                    setShowLoader(false)
                    window.location.href = "/Admin/Cars"
                }, 2000);
            } else {
                notifyError(res.data.errors[0])
                setShowLoader(false)
            }
        })
    }

    useEffect(() => {
        getLanguages().then(res => {
            if (res.data && res.data.length) {
                setLanguages(res.data)
                setSelectedLanguage(res.data[0].key)
                let lang = res.data[0]
                getFeatures().then(fet => {
                    if (fet.data && fet.data.length) {
                        setFeatures(fet.data)
                        setSelectedFeature(fet.data[0].id)
                        getCurrencies().then(async res => {
                            setCurrencies(res.data)
                            setselectedcurrency(res.data[0].id)
                            setselectedcurrencyName(res.data[0].names.find(name => name.language_id === lang.id).name)
                            setShowPageInput(true)
                        })
                    } else {
                        setShowMinsingLangWarning(true)
                    }
                })
            } else {
                setShowMinsingLangWarning(true)
            }
        })
    }, []);

    useEffect(() => {
        if (languages && languages.length && features && features.length)
            getCar(id).then(async res => {
                res.data.titles.map(title => {
                    let langKey = languages.find(language => language.id == title.language_id).key
                    setNames((prevState) => ({
                        ...prevState,
                        [langKey]: title.title,
                    }));
                })
                res.data.descriptions.map(description => {
                    let langKey = languages.find(language => language.id == description.language_id).key
                    setDescriptions((prevState) => ({
                        ...prevState,
                        [langKey]: description.description,
                    }));
                })
                res.data.types.map(type => {
                    let langKey = languages.find(language => language.id == type.language_id).key
                    setCategories((prevState) => ({
                        ...prevState,
                        [langKey]: type.type,
                    }));
                })
                setPhone(res.data.phone)
                res.data.prices.map(price => {
                    setPrices((prevState) => ({
                        ...prevState,
                        [price.currency_id]: price.price,
                    }));
                })

                let fs = []
                res.data.features.map(fet => {
                    fs.push(features.find(ff => ff.id == fet.pivot.feature_id))
                })
                setCarFeatures(fs)

                setOldGallery(res.data.gallery)
                let lat = res.data.lat
                let lng = res.data.lng
                const newCenter = { lat, lng };
                setCenter(newCenter);
                setLat(res.data.lat);
                setLng(res.data.lng);
                setAddress(res.data.address);
                setAddressName(res.data.address_name);
            })
    }, [features, languages])

    useEffect(() => {
        if (languages && languages.length && selectedLanguage) {
            const language = languages.find(language => language.key === selectedLanguage);
            if (language) {
                setSelectedLanguageName(language.name);
            }
        }
    }, [languages, selectedLanguage]);

    useEffect(() => {
        if (selectedPlace) {
            setAddress(selectedPlace.formatted_address)
            setAddressName(selectedPlace.name)
            setLat(selectedPlace.geometry.location.lat())
            setLng(selectedPlace.geometry.location.lng())
        }
    }, [selectedPlace]);

    return (
        <>
            <ToastContainer>
            </ToastContainer>
            {
                showPageInput && (
                    <>
                        <div className="d-flex gap-3">
                            <div className="w-75 form-group">
                                <label for="names">Car Name in ({selectedLanguageName})*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="names"
                                    placeholder="Car Name"
                                    value={names[selectedLanguage]}
                                    onChange={handleChangeName} />
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
                        <div className="d-flex gap-3 mt-3">

                            <div className="mt-3 w-100">
                                <div className="form-group">
                                    <label for="description">Category in ({selectedLanguageName})*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        placeholder="Car Category"
                                        value={categories[selectedLanguage]}
                                        onChange={handleChangeCategories} style={{ resize: "none", paddingTop: 10 }} rows={9} />
                                </div>
                            </div>
                            <div className="mt-3 w-100">
                                <div className="form-group">
                                    <label for="description">Phone *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Phone"
                                        placeholder="Phone"
                                        value={phone}
                                        onChange={handleChangePhone} style={{ resize: "none", paddingTop: 10 }} rows={9} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 w-100">
                            <div className="mt-3 w-100">
                                <div className="form-group">
                                    <label for="description">Brief in ({selectedLanguageName})*</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        placeholder="Car Brief"
                                        value={descriptions[selectedLanguage]}
                                        onChange={handleChangeDescription} style={{ resize: "none", paddingTop: 10 }} rows={9}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-3 w-100 mt-3">
                            <div className="w-75 form-group">
                                <label for="prices">Car Price per day in ({selectedcurrencyName})*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="prices"
                                    placeholder="Car Price per day"
                                    value={prices[selectedcurrency]}
                                    onChange={handleChangePrices} />
                            </div>
                            <div className="w-25 form-group">
                                <label for="Currencies" >Currencies</label>
                                <select id="currency" className="form-control" value={selectedcurrency} onChange={handleChangeCurrency}>
                                    {currencies.map((currency, index) => (
                                        <option key={index} value={currency.id}>
                                            {
                                                currency.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name
                                            }
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {
                            address && (
                                <div className='card mb-0 mt-3 p-3'>
                                    <h4>{addressName}</h4>
                                    <p className='mb-0'>{address}</p>
                                </div>
                            )
                        }
                        <div className='card mt-3 p-3'>
                            {
                                isGoogle == undefined && (
                                    <LoadScript googleMapsApiKey="AIzaSyBzXxR0ge7r2dT4BIVCl9uSLHKT9em6wzQ" libraries={libraries}>
                                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                            <input type="text" placeholder="Enter a location" className="w-100 form-control mb-2" />
                                        </Autocomplete>

                                        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} style={{ width: "100%" }}>
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

                                        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} style={{ width: "100%" }}>
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
                        <div>
                            <div className="w-100">
                                <div className="form-group">
                                    <label for="features">Choose Features*</label>
                                    <div className="d-flex gap-2">
                                        <select id="features" className="form-control" value={selectedFeature} onChange={handleChangeFeatures}>
                                            {features.map((feature, index) => (
                                                <option key={index} value={feature.id}>
                                                    {
                                                        feature.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name
                                                    }
                                                </option>
                                            ))}
                                        </select>
                                        <button className="btn btn-success" onClick={handleChooseFeature}>Choose</button>
                                        <button className="btn btn-primary" onClick={() => getFeatures().then(res => { setFeatures(res) })}>Reload</button>
                                    </div>
                                    <div className="card  mt-3">
                                        {carFeatures.map((item, index) => (
                                            <div className="d-flex gap-2 m-2 align-items-center" key={item.id} dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
                                                <img style={{ width: 40, height: 40, objectFit: "contain" }} src={url + item.icon_path} />
                                                <div className='w-100'>
                                                    <h3 className="m-0 w-100">{item.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name}
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
                                            "Upload Car Gallary*"
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

                        <Button className="btn btn-primary w-25" style={{ margin: "auto" }} onClick={() => handleUpdateCar()}>Update</Button>
                    </>
                )
            }
            {
                !showPageInput && !showMinsingLangWarning && (
                    <Loader />
                )
            }
            {
                showMinsingLangWarning &&
                (
                    <h2 className='text-center'>Please Add Languages, Features and Currencies first</h2>
                )
            }
            {
                showLoader && (
                    <div className='mainLoader' style={{ zIndex: 999, width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.57)' }} >
                        <Loader style={{ margin: 0 }}></Loader>
                    </div>
                )
            }
        </>
    )
}

export default UpdateCar;