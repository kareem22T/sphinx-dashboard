import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { creatRoom, updateRoom } from '../../../handeApisMethods/hotel';
import { getRoom } from '../../../handeApisMethods/hotel';
import { getFeatures } from '../../../handeApisMethods/feature'
import { deleteRoom } from '../../../handeApisMethods/hotel';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {format} from 'date-fns';
import { getLanguages } from '../../../handeApisMethods/languages';
import { getCurrencies } from '../../../handeApisMethods/currencies';
import { useMemo } from 'react';
import PageTitle from "../../layouts/PageTitle";
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from '../table/FilteringTable/GlobalFilter';
import '../table/FilteringTable/filtering.css';
import { ColumnFilter } from '../table/FilteringTable/ColumnFilter';
import Loader from '../spinerLoader/loader';
import { useParams } from 'react-router-dom';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { url } from '../../../handeApisMethods/a-MainVariables';


const UpdateRoom = () => {
    const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [showAdd, SetShowAdd] = useState(false);

    const [currencies, setCurrencies] = useState(null)
    const [selectedcurrency, setselectedcurrency] = useState('');
    const [selectedcurrencyName, setselectedcurrencyName] = useState('');

    const [names, setNames] = useState({})
    const [descriptions, setDescriptions] = useState({})
    const [prices, setPrices] = useState({})
    const [oldGallery, setOldGallery] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        setSelectedFiles([...selectedFiles, ...files]); // Update selected files

        const temporaryPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...temporaryPreviews]);
        console.log(previewImages);
    };

    const [largeModal, setLargeModal] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showDeletePopup, setShowsDeletePopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [hotelKey, setHotelKey] = useState('');
    const [RoomName, setRoomName] = useState('');
    const [hotelId, setHotelId] = useState(''); // the one on edit
    const [hotel, setHotel] = useState([])
    let { id } = useParams();
    const [features, setFeatures] = useState([])
    const [roomFeatures, setroomFeatures] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState('');

    const handleChangeFeatures = (e) => {
        const value = e.target.value;
        setSelectedFeature(value);
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

    const removeOldGallery = (indexToRemove) => {
        console.log(oldGallery);
        setOldGallery(prevOldGallery => prevOldGallery.filter((_, index) => index !== indexToRemove));
    }
    const removePreviewImgs = (indexToRemove) => {
        setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const handleChooseFeature = () => {
        if (roomFeatures.find(feature => feature.id == selectedFeature)) {
            notifyError("Feature already added")
        } else {
            setroomFeatures((prevState) => ([
                ...prevState,
                features.find(feature => feature.id == selectedFeature)
            ]));
        }
    }

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
    };
    const removeFeature = (indexToRemove) => {
        setroomFeatures(prevroomFeatures => prevroomFeatures.filter((_, index) => index !== indexToRemove));
    }
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

    const handleChangeName = (event) => {
        setNames((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeDescription = (event) => {
        setDescriptions((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangePrices = (event) => {
        setPrices((prevState) => ({
            ...prevState,
            [selectedcurrency]: event.target.value,
        }));
        console.log(prices);
    };

    const handleAddRoom = () => {
        updateRoom(id, oldGallery, names, descriptions, selectedFiles, prices, roomFeatures)
            .then(res => {
                if (res.data.status === true) {
                    notifyTopRight(res.data.message)
                    setTimeout(() => {
                        window.location.href = '/Admin/hotels'
                    }, 2000);
                } else {
                    notifyError(res.data.errors[0])
                }

            })

    }

    useEffect(() => {
        getRoom(id).then(async res => {
            await setHotel(res.data)
            getLanguages().then(res => {
                setLanguages(res.data)
                setSelectedLanguage(res.data[0].key)
                let lang = res.data[0]
                // console.log(res.data);
                getCurrencies().then(async res => {
                    await setCurrencies(res.data)
                    setselectedcurrency(res.data[0].id)
                    setselectedcurrencyName(res.data[0].names.find(name => name.language_id === lang.id).name)
                })
                getFeatures().then(fet => {
                    setFeatures(fet.data)
                    setSelectedFeature(fet.data[0].id)
                    setShowTable(true)
                })
            })
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
        if (currencies && currencies.length && selectedcurrency) {
            const Curruncy = currencies.find(curruncy => curruncy.code === selectedcurrency);
            if (Curruncy) {
                setselectedcurrencyName(Curruncy.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name);
            }
        }
    }, [currencies, selectedcurrency, languages]);
    useEffect(() => {
        if (languages && languages.length && features && features.length)
            getRoom(id).then(async res => {
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
                setroomFeatures(fs)

                setOldGallery(res.data.gallery)
            })
    }, [features, languages])


    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <ToastContainer>
                    </ToastContainer>
                    <div className="row">
                        {showTable && (
                            <>
                                <div className="d-flex gap-3">
                                    <div className="w-75 form-group">
                                        <label for="names">Room Name in ({selectedLanguageName})*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="names"
                                            placeholder="Room Name"
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
                                <div className="mt-3">
                                    <div className="form-group">
                                        <label for="description">Description in ({selectedLanguageName})*</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            placeholder="Room Description"
                                            value={descriptions[selectedLanguage]}
                                            onChange={handleChangeDescription} style={{ resize: "none", paddingTop: 10 }} rows={5}>
                                        </textarea>
                                    </div>
                                </div>
                                <div className='d-flex gap-3 w-100 mt-3'>
                                    <div className="d-flex gap-3 w-50">
                                        <div className="w-75 form-group">
                                            <label for="prices">Room Price in ({selectedcurrencyName})*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="prices"
                                                placeholder="Room Price"
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
                                    <div className="w-50">
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
                                                {roomFeatures.map((item, index) => (
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
                                        className="row">
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

                                <Button className="btn btn-primary w-25" style={{ margin: "auto" }} onClick={() => handleAddRoom()}>Update Room</Button>
                            </>
                        )}
                        {
                            !showTable && (
                                <Loader />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default UpdateRoom;