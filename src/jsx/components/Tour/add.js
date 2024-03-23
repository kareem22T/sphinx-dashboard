import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { getLanguages } from '../../../handeApisMethods/languages';
import { createTour } from '../../../handeApisMethods/tours';
import { Button, Modal } from "react-bootstrap";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { url } from "../../../handeApisMethods/a-MainVariables";
import { getCurrencies } from '../../../handeApisMethods/currencies';
import Loader from '../spinerLoader/loader';

const AddTour = () => {
    const [showPageInput, setShowPageInput] = useState(false)
    const [titles, setTitles] = useState('')
    const [includes, setIncludes] = useState('')
    const [excludes, setExcludes] = useState('')
    const [intros, setIntros] = useState('')
    const [locations, setLocations] = useState('')
    const [transportations, setTransportations] = useState('')
    const [days, setDays] = useState({})
    const [packages, setPackages] = useState({})
    const [numOfDays, setNumOfDays] = useState([""])
    const [expired_date, setExpired_date] = useState('')
    const [duration, setDuration] = useState(1)
    const [packages_num, setPackages_num] = useState(1)
    const [numOfPackages, setNumOfPackages] = useState([''])
    const [max_participant, setMax_Participant] = useState(0)
    const [min_participant, setMin_Participant] = useState(0)
    const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [largeModal, setLargeModal] = useState(false);
    const [packagefeatures, setPackageFeatures] = useState([]);
    const [icon_path, setIcon_path] = useState(null)
    const [selectedLanguage_feature, setSelectedLanguage_feature] = useState('');
    const [selectedLanguageName_feature, setSelectedLanguageName_feature] = useState('');
    const [names_feature, setNames_feature] = useState({})
    const [descriptions_feature, setDescriptions_feature] = useState({})
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(null)
    const [prices, setPrices] = useState({})
    const [currencies, setCurrencies] = useState(null)
    const [selectedcurrency, setselectedcurrency] = useState('');
    const [selectedcurrencyName, setselectedcurrencyName] = useState('');
    const [showMinsingLangWarning, setShowMinsingLangWarning] = useState(false)
    const [showLoader, setShowLoader] = useState(false)

    const handleChangeLang_feature = (e) => {
        const value = e.target.value;
        setSelectedLanguage_feature(value);
        setNames_feature((prevState) => ({
            ...prevState,
            [value]: names_feature[value] ? names_feature[value] : "",
          }));
        setDescriptions_feature((prevState) => ({
            ...prevState,
            [value]: descriptions_feature[value] ? descriptions_feature[value] : "",
          }));
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

    const handelAddFeature = (index) => {
        let isErrors = false
        languages.map(lang => {
            if (!names_feature[lang.key]) {
                notifyError("Please enter feature name in " + lang.name)
                isErrors = true;
            }
            if (!descriptions_feature[lang.key]) {
                notifyError("Please enter feature Description in " + lang.name)
                isErrors = true;
            }
        })

        if (!isErrors) {
            setPackages((prevState) => ({
                ...prevState, 
                [index]: {
                    ...(prevState[index] ? prevState[index] : null),
                    features: [
                        ...(prevState[index] &&  prevState[index]["features"] ? prevState[index]["features"]  : []),
                        {
                            names: names_feature,
                            descriptions: descriptions_feature,
                        }        
                    ]
                }
            }));    
            setLargeModal(false)
            setNames_feature({})
            setDescriptions_feature({})
            setIcon_path({})
            setCurrentFeatureIndex(null)
        }   
    }


    const handleCHangeIcon = (event) => {
        const file = event.target.files[0];
        setIcon_path(file);
    };

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
        setTitles((prevState) => ({
            ...prevState,
            [value]: titles[value] ? titles[value] : "",
          }));
        setIntros((prevState) => ({
            ...prevState,
            [value]: intros[value] ? intros[value] : "",
          }));
        setLocations((prevState) => ({
            ...prevState,
            [value]: locations[value] ? locations[value] : "",
          }));
        setTransportations((prevState) => ({
            ...prevState,
            [value]: transportations[value] ? transportations[value] : "",
          }));
        setIncludes((prevState) => ({
            ...prevState,
            [value]: includes[value] ? includes[value] : "",
          }));
          setExcludes((prevState) => ({
            ...prevState,
            [value]: excludes[value] ? excludes[value] : "",
          }));
    };

    const handleChangeTitles = (event) => {
        setTitles((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeIntros = (event) => {
        setIntros((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeLocations = (event) => {
        setLocations((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeTransportations = (event) => {
        setTransportations((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeIncludes = (event) => {
        setIncludes((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeExcludes = (event) => {
        setExcludes((prevState) => ({
            ...prevState,
            [selectedLanguage]: event.target.value,
        }));
    };

    const handleChangeDayThumbnails = (index) => (event) => {
        setDays((prevState) => ({
            ...prevState, 
            [index]: {
                ...(prevState[index] ? prevState[index] : null),
                thumbnail: event.target.files[0]
            }
        }));
    };
    
    const handleChangeDayTitles = (index) => (event) => {
        setDays((prevState) => ({
            ...prevState, 
            [index]: {
                ...(prevState[index] ? prevState[index] : null),
                titles: {
                    ...(prevState[index] &&  prevState[index]["titles"] ? prevState[index]["titles"]  : null),
                    [selectedLanguage]: event.target.value
                }
            }
        }));
    };

    const handleChangeName_feature = (event) => {
        setNames_feature((prevState) => ({
            ...prevState,
            [selectedLanguage_feature]: event.target.value,
          }));
      };

    const handleChangeDescription_feature = (event) => {
        setDescriptions_feature((prevState) => ({
            ...prevState,
            [selectedLanguage_feature]: event.target.value,
          }));
      };


    const handleChangePackageTitles = (index) => (event) => {
        setPackages((prevState) => ({
            ...prevState, 
            [index]: {
                ...(prevState[index] ? prevState[index] : null),
                titles: {
                    ...(prevState[index] &&  prevState[index]["titles"] ? prevState[index]["titles"]  : null),
                    [selectedLanguage]: event.target.value
                }
            }
        }));
    };

    const handleChangeDayDescriptions = (index) => (event) => {
        setDays((prevState) => ({
            ...prevState, 
            [index]: {
                ...(prevState[index] ? prevState[index] : null),
                descriptions: {
                    ...(prevState[index] &&  prevState[index]["descriptions"] ? prevState[index]["descriptions"]  : null),
                    [selectedLanguage]: event.target.value
                }
            }
        }));
    };

    const handleChangePackageDescriptions = (index) => (event) => {
        setPackages((prevState) => ({
            ...prevState, 
            [index]: {
                ...(prevState[index] ? prevState[index] : null),
                descriptions: {
                    ...(prevState[index] &&  prevState[index]["descriptions"] ? prevState[index]["descriptions"]  : null),
                    [selectedLanguage]: event.target.value
                }
            }
        }));
    };

    const handleChangePackagePrices = (index) => (event) => {
        setPackages((prevState) => ({
            ...prevState, 
            [index]: {
                ...(prevState[index] ? prevState[index] : null),
                prices: {
                    ...(prevState[index] &&  prevState[index]["prices"] ? prevState[index]["prices"]  : null),
                    [selectedcurrency]: event.target.value
                }
            }
        }));
    };

    const handleChangeExpired_date = (event) => {
        setExpired_date(event.target.value);
    };

    const handleChangeDuration = (event) => {
        setDuration(event.target.value);
        const repeatArray = Array.from({ length: event.target.value }, (_, index) => index);
        setNumOfDays(repeatArray)
    };

    const handleChangeMax_participant = (event) => {
        setMax_Participant(event.target.value);
    };

    const handleChangeMin_participant = (event) => {
        setMin_Participant(event.target.value);
    };

    const handleIncNumOfPackages = (event) => {
        const repeatArray = Array.from({ length: event.target.value }, (_, index) => index);
        setNumOfPackages(repeatArray)
        setPackages_num(event.target.value)
    }

    const handleShowAddFeature = (index) => {
        setCurrentFeatureIndex(index); setLargeModal(true)
    }

    const removePackageFeature = (index, featureIndex) => {
        setPackages((prevState) => {
          const updatedFeatures = (prevState[index]?.features || []).filter((_, indexf) => indexf !== featureIndex);
          return {
            ...prevState,
            [index]: {
              ...(prevState[index] || {}),
              features: updatedFeatures.length === 0 ? undefined : updatedFeatures,
            },
          };
        });
      };
      
      const handleAddTour = () => {
        setShowLoader(true)
        createTour(titles, intros, locations, transportations, duration, expired_date, min_participant, max_participant, includes, excludes, days, packages, selectedFiles).then(res => {
            if (res.data.status === true) {
                notifyTopRight(res.data.message)
                setTimeout(() => {
                    setShowLoader(false)
                    window.location.href = "/Admin/Tours"
                }, 2000);
            } else {
                notifyError(res.data.errors[0])
                setShowLoader(false)
            }
        })
    }

	useEffect(() => {
        getLanguages().then(res => {
            setLanguages(res.data)
            if (res.data && res.data.length) {
                setSelectedLanguage(res.data[0].key)
                setSelectedLanguage_feature(res.data[0].key)
                setShowPageInput(true)
            } else {
                setShowMinsingLangWarning(true)
            }
        })
	}, []);

    useEffect(() => {
        if (languages && languages.length && selectedLanguage) {
          const language = languages.find(language => language.key === selectedLanguage);
          if (language) {
            let lang = language
            getCurrencies().then(async res => {
                if (res.data && res.data.length) {
                    await setCurrencies(res.data)
                    setselectedcurrency(res.data[0].id)
                    setselectedcurrencyName(res.data[0].names.find(name => name.language_id === lang.id).name)
                } else {
                    setShowPageInput(false)
                    setShowMinsingLangWarning(true)    
                }
            })
            setSelectedLanguageName(language.name);
          }
        }
      }, [languages, selectedLanguage]);

      useEffect(() => {
        if (languages && languages.length && selectedLanguage_feature) {
          const language = languages.find(language => language.key === selectedLanguage_feature);
          if (language) {
            setSelectedLanguageName_feature(selectedLanguage_feature);
          }
        }
      }, [languages, selectedLanguage_feature]);

    return (
        <>
            <ToastContainer>
            </ToastContainer>
            <div className="row">
                <div className="col-xl-12">
                    {
                        showPageInput && (
                            <>
                                <h2 className="mb-4">Set Tour data in ({selectedLanguageName})</h2>
                                <div className="d-flex gap-3">
                                    <div className="w-75 form-group">
                                        <label for="names">Tour Title in ({selectedLanguageName})*</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="names"
                                            placeholder="Tour Title"
                                            value={titles[selectedLanguage]}
                                            onChange={handleChangeTitles} />
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
                                <div className='mt-3 d-flex gap-3'>
                                    <div className="w-50 form-group">
                                        <label for="names">Tour Intro in ({selectedLanguageName})*</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="Intro"
                                            placeholder="Tour Intro"
                                            value={intros[selectedLanguage]}
                                            onChange={handleChangeIntros} />
                                    </div>
                                    <div className="w-50 form-group">
                                        <label for="num_of_packages">Num of Packages*</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            className="form-control"
                                            id="num_of_packages"
                                            placeholder="Num of Packages"
                                            value={packages_num}
                                            onChange={handleIncNumOfPackages} />
                                    </div>
                                </div>
                                <div className='mt-3 d-flex gap-3'>
                                    <div className="w-50 form-group">
                                        <label for="names">Tour Location in ({selectedLanguageName})*</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="Location"
                                            placeholder="Tour Location"
                                            value={locations[selectedLanguage]}
                                            onChange={handleChangeLocations} />
                                    </div>
                                    <div className="w-50 form-group">
                                        <label for="Transportations">Tour Transportations in ({selectedLanguageName})*</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="Transportations"
                                            placeholder="Tour Transportation"
                                            value={transportations[selectedLanguage]}
                                            onChange={handleChangeTransportations} />
                                    </div>
                                </div>
                                <div className='mt-3 d-flex gap-3'>
                                    <div className="w-50 form-group">
                                        <label for="names">Tour Expired date*</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="Expired_date"
                                            placeholder="Tour Expired date"
                                            value={expired_date}
                                            onChange={handleChangeExpired_date} />
                                    </div>
                                    <div className="w-50 form-group">
                                        <label for="names">Tour Duration in days *</label>
                                        <input 
                                            type="number"
                                            className="form-control"
                                            id="Duration"
                                            placeholder="Tour Duration"
                                            min={1}
                                            value={duration}
                                            onChange={handleChangeDuration} />
                                    </div>
                                </div>
                                <div className='mt-3 d-flex gap-3'>
                                    <div className="w-50 form-group">
                                        <label for="min_participants">Tour Min Participants*</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            className="form-control"
                                            id="min_participants"
                                            placeholder="Tour Min Participants"
                                            value={min_participant}
                                            onChange={handleChangeMin_participant} />
                                    </div>
                                    <div className="w-50 form-group">
                                        <label for="max_participants">Tour Max Participants*</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            className="form-control"
                                            id="max_participants"
                                            placeholder="Tour Max Participants"
                                            value={max_participant}
                                            onChange={handleChangeMax_participant} />
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <div className="w-100 form-group">
                                        <label for="Includes">Tour Includes in ({selectedLanguageName})*</label>
                                        <textarea 
                                            type="text"
                                            className="form-control p-3"
                                            id="Includes"
                                            placeholder="Tour Includes"
                                            value={includes[selectedLanguage]}
                                            onChange={handleChangeIncludes}
                                            rows="6"
                                            style={{resize: 'none'}} />
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <div className="w-100 form-group">
                                        <label for="Excludes">Tour Excludes in ({selectedLanguageName})*</label>
                                        <textarea 
                                            type="text"
                                            className="form-control p-3"
                                            id="Excludes"
                                            placeholder="Tour Excludes"
                                            value={excludes[selectedLanguage]}
                                            onChange={handleChangeExcludes}
                                            rows="6"
                                            style={{resize: 'none'}} />
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
                                                        "Upload Tour Gallary*"
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
                                {
                                    numOfDays.map((item, index) => (
                                        <div className='mt-3 card p-3' style={{height: 'max-content'}} key={index}>
                                            <h2 className='text-center'>Day #{index + 1}</h2>
                                            <div className='d-flex gap-3'>
                                                <div className='w-25'> 
                                                    <label htmlFor={"dayThumbnail_" + (index + 1)}>
                                                        {
                                                            (!days[index + 1] || !days[index + 1]["thumbnail"]) && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo-up" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" style={{width: '200px', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} stroke="#043343" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                    <path d="M15 8h.01" />
                                                                    <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                                                                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5" />
                                                                    <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526" />
                                                                    <path d="M19 22v-6" />
                                                                    <path d="M22 19l-3 -3l-3 3" />
                                                                </svg>                                                
                                                            )
                                                        }
                                                        {
                                                            (days[index + 1] && days[index + 1]["thumbnail"]) && (
                                                                <img src={URL.createObjectURL(days[index + 1]["thumbnail"])} style={{width: '200px', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} alt={"Day Thumbnail " + (index + 1)} />
                                                            )
                                                        }
                                                    </label> 
                                                    <input 
                                                        type='file'
                                                        className='form-control d-none'
                                                        id={"dayThumbnail_" + (index + 1)}
                                                        onChange={handleChangeDayThumbnails(index + 1)}
                                                    />
                                                </div>
                                                <div className='w-100'>
                                                    <div className="w-100 form-group">
                                                        <label htmlFor={"day_" + (index + 1) + "_title"}>Day {index + 1} Title in ({selectedLanguageName})*</label>
                                                        <input 
                                                            type="text"
                                                            className="form-control"
                                                            id={"day_" + (index + 1) + "_title"}
                                                            placeholder={"Day " + (index + 1) + " Title"}
                                                            value={days[index + 1] && days[index + 1]["titles"] && days[index + 1]["titles"][selectedLanguage] ? days[index + 1]["titles"][selectedLanguage] : ''}
                                                            onChange={handleChangeDayTitles(index + 1)} />
                                                    </div>

                                                    <div className="w-100 form-group mt-3">
                                                        <label htmlFor={"day_" + (index + 1) + "_description"}>Day {index + 1} Description in ({selectedLanguageName})*</label>
                                                        <textarea 
                                                            type="text"
                                                            className="form-control"
                                                            id={"day_" + (index + 1) + "_description"}
                                                            placeholder={"Day " + (index + 1) + " Description"}
                                                            value={days[index + 1] && days[index + 1]["descriptions"] && days[index + 1]["descriptions"][selectedLanguage] ? days[index + 1]["descriptions"][selectedLanguage] : ''}
                                                            rows={4}
                                                            style={{resize: "none"}}
                                                            onChange={handleChangeDayDescriptions(index + 1)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                    <div className='gap-3' style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                                    {
                                        numOfPackages.map((item, index) => (
                                            <div className='mt-3 card p-3' style={{height: 'max-content'}} key={index}>
                                                <h2 className='text-center'>Package #{index + 1}</h2>
                                                <div className='d-flex gap-3'>
                                                    <div className='w-100'>
                                                        <div className="w-100 form-group">
                                                            <label htmlFor={"package_" + (index + 1) + "_title"}>Package {index + 1} Title in ({selectedLanguageName})*</label>
                                                            <input 
                                                                type="text"
                                                                className="form-control"
                                                                id={"package_" + (index + 1) + "_title"}
                                                                placeholder={"package " + (index + 1) + " Title"}
                                                                value={packages[index + 1] && packages[index + 1]["titles"] && packages[index + 1]["titles"][selectedLanguage] ? packages[index + 1]["titles"][selectedLanguage] : ''}
                                                                onChange={handleChangePackageTitles(index + 1)} />
                                                        </div>

                                                        <div className="w-100 form-group mt-3">
                                                            <label htmlFor={"day_" + (index + 1) + "_description"}>Package {index + 1} Description in ({selectedLanguageName})*</label>
                                                            <textarea 
                                                                type="text"
                                                                className="form-control"
                                                                id={"day_" + (index + 1) + "_description"}
                                                                placeholder={"Package " + (index + 1) + " Description"}
                                                                value={packages[index + 1] && packages[index + 1]["descriptions"] && packages[index + 1]["descriptions"][selectedLanguage] ? packages[index + 1]["descriptions"][selectedLanguage] : ''}
                                                                rows={4}
                                                                style={{resize: "none"}}
                                                                onChange={handleChangePackageDescriptions(index + 1)} />
                                                        </div>
                                                        <div className="d-flex gap-3 w-100 mt-3">
														<div className="w-75 form-group">
															<label for="prices">Package Price in ({selectedcurrencyName})*</label>
															<input 
																type="text"
																className="form-control"
																id="prices"
																placeholder="Package Price"
																value={packages[index + 1] && packages[index + 1]["prices"] && packages[index + 1]["prices"][selectedcurrency] ? packages[index + 1]["prices"][selectedcurrency] : ''}
																onChange={handleChangePackagePrices(index + 1)} />
														</div>
                                                        {currencies && (
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
                                                        )}
													</div>

                                                        <div className="w-100">
                                                            <div className="d-flex gap-2 justify-content-between form-group" style={{marginTop: 32}}>
                                                                <h3>Features to choose Package</h3>
                                                                <button className="btn btn-sm btn-success" onClick={() => handleShowAddFeature(index + 1)}>Add feature</button>
                                                            </div>
                                                            {   
                                                                (packages[index + 1] && packages[index + 1]["features"] && packages[index + 1]["features"].length) && (
                                                                    packages[index + 1]["features"].map((item, findex) => (
                                                                    <div className="d-flex gap-2 mt-3" dir={selectedLanguage === "AR" ? "rtl" : "ltr"}>
                                                                        <div>
                                                                            <h4 className="m-0">
                                                                                {item.names[selectedLanguage]}
                                                                                <button onClick={() => removePackageFeature(index + 1, findex)} style={{ background: "transparent", border: "none", borderRadius: "50%", float: "right" }}>
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
                                                                    ))
                                                                )
                                                            }                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    </div>                            
                                <Modal
                                    className="fade bd-example-modal-lg"
                                    show={largeModal}
                                    size="lg"
                                    >
                                        <Modal.Header>
                                            <Modal.Title>
                                                {
                                                    "Add New Feature"
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
                                                <div className="d-flex gap-3 mt-3">
                                                    <div className="w-75 form-group">
                                                        <label for="names">Feature Title in ({selectedLanguage_feature})*</label>
                                                        <input 
                                                            type="text"
                                                            className="form-control"
                                                            id="names"
                                                            placeholder="Feature title"
                                                            value={names_feature[selectedLanguage_feature]}
                                                            onChange={handleChangeName_feature} />
                                                    </div>
                                                    <div className="w-25 form-group">
                                                        <label for="languages" >Languages</label>
                                                        <select id="languages" className="form-control" value={selectedLanguage_feature} onChange={handleChangeLang_feature}>
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
                                                        <label for="description">Feature Description in ({selectedLanguage_feature})*</label>
                                                        <input 
                                                            type="text"
                                                            className="form-control"
                                                            id="description"
                                                            placeholder="Feature Description"
                                                            value={descriptions_feature[selectedLanguage_feature]}
                                                            onChange={handleChangeDescription_feature} style={{resize: "none", paddingTop: 10}} rows={5} />
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
                                                onClick={() => handelAddFeature(currentFeatureIndex)}
                                            >
                                                Add
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                                                
                                <Button className="btn btn-primary w-25 mt-3" style={{margin: "auto"}} onClick={() => handleAddTour()}>Create</Button>
                            </>
                        )
                    }
                </div>
                {
                    !showPageInput && !showMinsingLangWarning &&(
                        <Loader />
                    )
                }
                {
                    showMinsingLangWarning &&
                    (
                        <h2 className='text-center'>Please Add Languages First and Currencies</h2>
                    )
                }

                {
                    showLoader && (
                        <div className='mainLoader' style={{ zIndex: 999, width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.57)'}} >
                            <Loader style={{margin: 0}}></Loader>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default AddTour;