import { getLanguages } from '../../../handeApisMethods/languages';
import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from "@react-google-maps/api";
import { Button, Modal } from "react-bootstrap";
import { createResturant } from '../../../handeApisMethods/resturants';
import { ToastContainer, toast } from "react-toastify";
import Loader from '../spinerLoader/loader';
import { useParams } from 'react-router-dom';
import {getResturant} from '../../../handeApisMethods/resturants';
import {updateResturant} from '../../../handeApisMethods/resturants';
import { url } from '../../../handeApisMethods/a-MainVariables';
const mapContainerStyle = {

  height: "500px",

  width: "100%",
  borderRadius: 10

};


const libraries = ["places"];
const AddResturant = () => {
  const [center, setCenter] = useState({

    lat: 40.712776,
  
    lng: -74.005974,
  
  })
  let { id } = useParams();

  const [showPageInput, setShowPageInput] = useState(false)
  const [languages, setLanguages] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLanguageName, setSelectedLanguageName] = useState('');
  const [showMinsingLangWarning, setShowMinsingLangWarning] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [names, setNames] = useState({})
  const [descriptions, setDescriptions] = useState({})
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnail_url, setThumbnail_url] = useState(null)
  const [isGoogle] = useState(window.google)

  const [address, setAddress] = useState(null)
  const [addressName, setAddressName] = useState(null)
  const [lng, setLng]  = useState(null)
  const [lat, setLat]  = useState(null)

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
  const handleChangeName = (event) => {
    setNames((prevState) => ({
      ...prevState,
      [selectedLanguage]: event.target.value,
    }));
    console.log(names);
  };

  const handleChangeDescription = (event) => {
    setDescriptions((prevState) => ({
      ...prevState,
      [selectedLanguage]: event.target.value,
    }));
  };
  const handleChangeResturantThumbnail = (event) => {
    setThumbnail(event.target.files[0])
  }

  const handleAddResturant = () => {
    updateResturant(id, thumbnail, names, descriptions, address, addressName, lng, lat).then(res => {
        if (res.data.status === true) {
            notifyTopRight(res.data.message)
            setTimeout(() => {
                setShowLoader(false)
                window.location.href = "/Admin/Resturants"
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

  useEffect(() => {
    if (languages) {
      getResturant(id).then(res => {
        res.data.titles.map(title => {
          let langKey = languages.find(language => language.id == title.language_id).key

          if (langKey)
          setNames((prevState) => ({
              ...prevState,
              [langKey]: title.title,
          }));
        })
        res.data.descriptions.map(description => {
          let langKey = languages.find(language => language.id == description.language_id).key

          if (langKey)
          setDescriptions((prevState) => ({
              ...prevState,
              [langKey]: description.description,
          }));
        })
        setThumbnail_url(res.data.thumbnail)
        let lat = res.data.lat
        let lng = res.data.lng
        const newCenter = { lat, lng };
        setCenter(newCenter);
        setLat(res.data.lat);
        setLng(res.data.lng);
        setAddress(res.data.address);
        setAddressName(res.data.address_name);
  
      })
    }
  }, [languages]);

  return (
    <>
      <ToastContainer>
      </ToastContainer>
      {
        showPageInput && (
          <>
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
            <div  className="d-flex gap-3 mt-3">
              <div className='w-25 card p-3 d-flex justify-content-center align-items-center m-0'> 
                  <label htmlFor={"resturant"}>
                      {
                          (!thumbnail && !thumbnail_url) && (
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
                          (thumbnail || thumbnail_url) && (
                              <img src={thumbnail ? URL.createObjectURL(thumbnail) : url + thumbnail_url} style={{width: '200px', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} alt={"thumbnail"} />
                          )
                      }
                  </label> 
                  <input 
                      type='file'
                      className='form-control d-none'
                      id={"resturant"}
                      onChange={handleChangeResturantThumbnail}
                  />
              </div>

              <div className="mt-3 w-100">
                <div className="form-group">
                  <label for="description">Brief in ({selectedLanguageName})*</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="description"
                    placeholder="Resturant Brief"
                    value={descriptions[selectedLanguage]}
                    onChange={handleChangeDescription} style={{ resize: "none", paddingTop: 10 }} rows={9}>
                  </textarea>
                </div>
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
            <Button className="btn btn-primary w-25" style={{margin: "auto"}} onClick={() => handleAddResturant()}>Update</Button>
          </>
        )
      }
    </>
  )
}

export default AddResturant;