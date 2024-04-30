import React, { useEffect, useState } from 'react';
import { url } from "../../../handeApisMethods/a-MainVariables";
import { getTour } from "../../../handeApisMethods/tours";
import { ToastContainer, toast } from "react-toastify";
import { getHomeTours, saveHomeTours, getHomeHotels, saveHomeHotels, saveHomeAd, getHomeAd } from '../../../handeApisMethods/settings';
import { getHotel } from '../../../handeApisMethods/hotel';

const Setting = () => {
    const [tourId, setTourId] = useState()
    const [hotelId, setHotelId] = useState()
    const handleChangeTourId = (e) => {
        setTourId(e.target.value)
    }
    const [homeTours, setHomeTours] = useState([]);
    const [homeHotels, setHomeHotels] = useState([]);
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailPath, setThumbnailPath] = useState(null)
    const [adTitleEn, setAdTitleEn] = useState(null)
    const [adTitleAr, setAdTitleAr] = useState(null)
    const [adTextEn, setAdTextEn] = useState(null)
    const [adTextAr, setAdTextAr] = useState(null)

    const handleAddTourToHome = (event) => {
        setTourId(event.target.value)
    }

    const handleAddHotelToHome = (event) => {
        setHotelId(event.target.value)
    }

    const handleChangeAdTitleEn = (event) => {
        setAdTitleEn(event.target.value)
    }

    const handleChangeAdTitleAr = (event) => {
        setAdTitleAr(event.target.value)
    }

    const handleChangeAdTextEn = (event) => {
        setAdTextEn(event.target.value)
    }

    const handleChangeAdTextAr = (event) => {
        setAdTextAr(event.target.value)
    }

    const handleRemoveTour = (indexToRemove) => {
        setHomeTours(prev => prev.filter((_, index) => index !== indexToRemove));
    }
    const handleRemoveHotel = (indexToRemove) => {
        setHomeHotels(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const handleChangeResturantThumbnail = (event) => {
        setThumbnail(event.target.files[0])
      }    

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

    const handleAddTour = () => {
        getTour(tourId).then(res => {
            if (res.data) {
                if (homeTours.length > 0 && homeTours.find(tour => tour.id == tourId)) {
                    notifyError("Tour already added")
                }else{
                    setHomeTours((prevState) => ([
                        ...prevState,
                        res.data
                    ]));
                    // setTourId(null)
                }        
            } else {
                notifyError("Invalid id")
            }
        })
        console.log(homeTours);
    }

    const handleAddHotel = () => {
        getHotel(hotelId).then(res => {
            if (res.data) {
                if (homeHotels.length > 0 && homeHotels.find(hotel => hotel.id == hotelId)) {
                    notifyError("Hotel already added")
                }else{
                    setHomeHotels((prevState) => ([
                        ...prevState,
                        res.data
                    ]));
                    // setTourId(null)
                }        
            } else {
                notifyError("Invalid id")
            }
        })
    }

    const handleSetHomeTours = () => {
        saveHomeTours(homeTours.map(obj => obj.id))
        .then(res => {
            if (res.data.status === true) {
                notifyTopRight(res.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                notifyError(res.data.errors[0])
            }

        })

    }

    const handleSetHomeHotels = () => {
        saveHomeHotels(homeHotels.map(obj => obj.id))
        .then(res => {
            if (res.data.status === true) {
                notifyTopRight(res.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                notifyError(res.data.errors[0])
            }

        })

    }

    const handleSetHomeAd = () => {
        if (!adTitleEn) {
            notifyError("Add ad title in English")
        }  
        else if (!adTitleAr) {
            notifyError("Add ad title in Arabic")
        } else if (!adTextEn) {
            notifyError("Add ad Text in English")
        } else if (!adTextAr) {
            notifyError("Add ad Text in Arabic")
        }
        else if (!thumbnail) {
            notifyError("Choose ad image")
        } else {
            saveHomeAd({
                title_ar: adTitleAr,
                title_en: adTitleEn,
                text_en: adTextEn,
                text_ar: adTextAr,
            }, thumbnail)
            .then(res => {
            if (res.data.status === true) {
                notifyTopRight(res.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                notifyError(res.data.errors[0])
            }
            
        })
    }

    }

    useEffect(() => {
        getHomeTours().then(res => {
            setHomeTours(res.data)
        })
        getHomeHotels().then(res => {
            setHomeHotels(res.data)
        })
        getHomeAd().then(res => {
            if (res.data) {
                setAdTitleAr(res.data.title_ar)
                setAdTitleEn(res.data.title_en)
                setAdTextAr(res.data.text_ar)
                setAdTextEn(res.data.text_en)
                setThumbnailPath(res.data.thumbnail_path)
            }
        })
    }, [])

    return (

    <div>
        <div className="row">
            <ToastContainer>
            </ToastContainer>

            <div className="col-xl-12">
                <div className="row">
                    <div>
                        <div className="d-flex gap-3 justify-content-between mb-3">
                            <h3>Set Home Tours</h3> 
                            <div className="d-flex w-75 gap-3">
                                <input className="form-control w-75" placeholder="Tour #id" value={tourId} onChange={handleAddTourToHome}/>
                                <button className="btn btn-secondary w-50" onClick={handleAddTour}>Add</button>
                                <button className="btn btn-success w-50" onClick={handleSetHomeTours}>Save</button>
                            </div>
                        </div>
                        <div className="gap-3 mt-3 w-100" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                            {
                                (homeTours && homeTours.length > 0) && (
                                    homeTours.map((tour, index) => (
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
                    </div>
                </div>
                <div className="row">
                    <div>
                        <div className="d-flex gap-3 justify-content-between mb-3">
                            <h3>Set Home Hotels</h3> 
                            <div className="d-flex w-75 gap-3">
                                <input className="form-control w-75" placeholder="Hotel #id" value={hotelId} onChange={handleAddHotelToHome}/>
                                <button className="btn btn-secondary w-50" onClick={handleAddHotel}>Add</button>
                                <button className="btn btn-success w-50" onClick={handleSetHomeHotels}>Save</button>
                            </div>
                        </div>
                        <div className="gap-3 mt-3 w-100" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                            {
                                (homeHotels && homeHotels.length > 0) && (
                                    homeHotels.map((hotel, index) => (
                                        <div className="card gap-3 p-3"  style={{display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative"}}>
                                            <button onClick={() => handleRemoveHotel(index)} className="btn btn-sm btn-danger p-2" style={{position: "absolute", top: 10, right: 10, height: 30}}>X</button>
                                            <img src={url + hotel.gallery[0].path} style={{width: "100%", borderRadius: 10}} />
                                            <div>
                                                <h3>{hotel.names[0].name}</h3>
                                                <p className="m-0">{hotel.slogans[0].slogan}</p>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <div className="d-flex gap-3 justify-content-between mb-3">
                            <h3>Set Home Advertisment</h3> 
                        </div>
                        <div className='d-flex gap-3 mb-3'>
                            <div className='w-50'>
                                <label htmlFor={"resturant"} className='w-100'>
                                    {
                                        (!thumbnail && !thumbnailPath) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo-up" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" style={{width: '200px', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem', width: "100%"}} stroke="#043343" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
                                        (thumbnail || thumbnailPath) && (
                                            <img src={(thumbnailPath && !thumbnail) ? (url + thumbnailPath) : URL.createObjectURL(thumbnail)} style={{width: '100%', maxHeight: 250, objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} alt={"thumbnail"} />
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
                            <div className='w-50'>
                                <input className="form-control w-100 mb-3" placeholder="Ad Title in English" value={adTitleEn} onChange={handleChangeAdTitleEn}/>
                                <input className="form-control w-100 mb-3" placeholder="Ad Title in Arabic" value={adTitleAr} onChange={handleChangeAdTitleAr}/>
                                <input className="form-control w-100 mb-3" placeholder="Ad Text in English" value={adTextEn} onChange={handleChangeAdTextEn}/>
                                <input className="form-control w-100 mb-3" placeholder="Ad Text in Arabic" value={adTextAr} onChange={handleChangeAdTextAr}/>
                                <button className="btn btn-success w-100" onClick={handleSetHomeAd}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Setting;