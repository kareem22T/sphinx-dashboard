import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from "react-bootstrap";
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { getLanguages } from '../../../handeApisMethods/languages';
import { getFeatures } from '../../../handeApisMethods/feature'
import { createHotel } from '../../../handeApisMethods/hotel';
import Loader from '../spinerLoader/loader';
// import React, { useState } from 'react';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { url } from "../../../handeApisMethods/a-MainVariables";
const UpdateHotel = () => {
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

    const [hotelReasons, setHotelReasons] = useState([]);
    const [hotelFeatures, setHotelFeatures] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

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
        }else{
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

    const handleUpdateHotel =  () => {
        createHotel(names, slogans ? slogans : [], descriptions, addresses, phone, selectedFiles, map, check_in, check_out, hotelFeatures, hotelReasons)
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
                                        <div className="w-75 form-group">
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
                                                onChange={handleChangeDescription} style={{resize: "none", paddingTop: 10}} rows={5}>
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
                                    <div className="mt-3">
                                        <div className="form-group">
                                            <label for="description">Google Map iframe*</label>
                                            <textarea 
                                                type="text"
                                                className="form-control"
                                                id="description"
                                                placeholder="Hotel Addresses"
                                                value={map}
                                                onChange={handleSetMap} style={{resize: "none", paddingTop: 10}} rows={5}>
                                            </textarea>
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
                                            <div className="d-flex gap-2 justify-content-between form-group" style={{marginTop: 32}}>
                                                <h3>Reasons to choose hotel</h3>
                                                <button className="btn btn-sm btn-success" onClick={() => setLargeModal(true)}>Add Reason</button>
                                            </div>
                                            {hotelReasons.map((item,index)=>(
                                                                    <div className="d-flex gap-2 mt-3" dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
                                                                        <img style={{width: 40,height: 40,objectFit: "contain" }} src={URL.createObjectURL(item.thumbnail)} />
                                                                        <div>
                                                                            <h4 className="m-0">{item.names[selectedLanguage]}</h4>
                                                                            <p className="pr-3" style={{lineHeight: "19px", marginTop: "5px"}}>{item.descriptions[selectedLanguage]}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
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
                                                    <button className="btn btn-primary" onClick={() => getFeatures().then(res => {setFeatures(res)})}>Reload</button>
                                                </div>
                                                <div className="card  mt-3">
                                                    {hotelFeatures.map((item,index)=>(
                                                        <div className="d-flex gap-2 m-2 align-items-center" key={item.id} dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
                                                            <img style={{width: 40,height: 40,objectFit: "contain" }} src={url + item.icon_path} />
                                                            <div>
                                                                <h3 className="m-0">{item.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name}</h3>
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
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                    <path d="M15 8h.01" />
                                                    <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                                                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                                                    <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                                                    <path d="M16 19h6" />
                                                    <path d="M19 16v6" />
                                                </svg>
                                            </label>
                                            <input type="file" id="gallary" multiple className="form-control" onChange={handleFileUpload} style={{display: "none"}}/>                                        
                                            </div>
                                    </div>
                                    <div id="preview-gallery" className="mt-3">
                                        {previewImages.length > 0 && (
                                        <LightGallery
                                            onInit={() => console.log('LightGallery initialized')}
                                            speed={500}
                                            plugins={[lgThumbnail, lgZoom]}
                                            elementClassNames="row"
                                        >
                                            {previewImages.map((item,index)=>(
                                                                    <div data-src={item} className="col-lg-3 col-md-6 mb-4" key={index}>
                                                                        <img src={item} style={{width:"100%", height: 250, objectFit: 'cover'}} alt="gallery" className='cursor-pointer'/>
                                                                    </div>
                                                                ))}

                                        </LightGallery>
                                        )}
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
                                                            onChange={handleChangeDescription_reason} style={{resize: "none", paddingTop: 10}} rows={5}>
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
                                    <Button className="btn btn-primary w-25" style={{margin: "auto"}} onClick={() => handleUpdateHotel()}>Create</Button>
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