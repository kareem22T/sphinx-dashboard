import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { creatRoom } from '../../../handeApisMethods/hotel';
import { getHotel } from '../../../handeApisMethods/hotel';
import { getFeatures } from '../../../handeApisMethods/feature'
import { Link } from "react-router-dom";
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

const Hotel = () => {
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


	const columns =
		[
			{
				Header: 'Thumbnail',
				accessor: (row) => row.gallery.length ? row.gallery[0].path : "",
				Cell: ({ value }) => {
					return <img src={url + value} alt="Hotel Thumbnail" style={{width: 50, height: 50, objectFit: "cover", borderRadius: 15, border: "1px solid white"}} />;
				},
			},
			{
				Header: 'Name',
				accessor: (row) => row.names[0]["name"],
				Cell: ({ value }) => {
					return <h5 style={{margin: 0}}>{value}</h5>;
				},
			},
			{
				Header: 'Action',
				accessor: (row) => row.id, // Or unique identifier from your data
				Cell: ({ row }) => (
					<>
						<Link className='btn-sm btn btn-success' to={"/room/edit/" + row.original.id}><i class="fas fa-pencil-alt"></i></Link>
						<button className='btn-sm btn m-2 btn-danger' onClick={() => handleShowDeleteWarning(row.original)}><i class="fas fa-trash"></i></button>
					</>
				),
			},
		]

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

	const handleShowEdit = (hotel) => {
		setHotelId(hotel.id)
		setHotelKey(hotel.key)
		setRoomName(hotel.name)
		setIsEdit(true)
		setLargeModal(true)
	}
	const handleShowDeleteWarning = (hotel) => {
		setHotelId(hotel.id)
		setHotelKey(hotel.key)
		setRoomName(hotel.names[0]["name"])
		setShowsDeletePopup(true)
	}
    const handleChooseFeature = () => {
        if (roomFeatures.find(feature => feature.id == selectedFeature)) {
            notifyError("Feature already added")
        }else{
            setroomFeatures((prevState) => ([
                ...prevState,
                features.find(feature => feature.id == selectedFeature)
            ]));
        }
    }

	const handleDelete = (id) => {
		if (id) {
			deleteRoom(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getHotel().then(res => {
						setHotel(res.data)
						setShowsDeletePopup(false)
						setShowTable(false)
						setTimeout(() => {
							setShowTable(true)
						}, 300);
					})
				} else {
					notifyError(res.data.errors[0])
				}

			})
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
        creatRoom(hotel.id, names, descriptions, selectedFiles, prices, roomFeatures)
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

	useEffect(() => {
		getHotel(id).then(async res => {
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


	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<ToastContainer>
					</ToastContainer>
					<div className="row">
						{showTable && (
                            <>
                                <div className='d-flex gap-3 justify-content-bettween mb-5'>
                                    {
                                        hotel && (
                                            <>
                                                <img src={url + hotel.gallery[0].path} alt="Hotel Thumbnail" style={{width: 220, height: 200, objectFit: "cover", borderRadius: 15, border: "1px solid white"}} />
                                                <div style={{display: 'flex', flexDirection: "column", alignItems: "space-between", justifyContent: "start"}}>
                                                    <h2>{hotel.names[0].name}</h2>
                                                    <p>{hotel.descriptions[0].description}</p>
                                                    <a className='btn btn-success w-25' style={{minWidth: 150}}>Edit Hotel Data</a>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                                <TableComponent
                                    rows={hotel.rooms}
                                    columns={columns}
                                    activename="Preview"
                                    sectionname="Hotel Rooms"
                                    add_btn="Add New Room"
									btnClick={() => SetShowAdd(!showAdd)}
                                    notDataFoundMsg="There is no Added Rooms yet!" />
									{
										showAdd && (
											<>
												<h2 className="mb-4">Set Room data in ({selectedLanguageName})</h2>
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
															onChange={handleChangeDescription} style={{resize: "none", paddingTop: 10}} rows={5}>
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
																<button className="btn btn-primary" onClick={() => getFeatures().then(res => {setFeatures(res)})}>Reload</button>
															</div>
															<div className="card  mt-3">
																{roomFeatures.map((item,index)=>(
																	<div className="d-flex gap-2 m-2 align-items-center" key={item.id} dir={selectedLanguage == "AR" ? "rtl" : "ltr"}>
																		<img style={{width: 40,height: 40,objectFit: "contain" }} src={url + item.icon_path} />
																		<div className='w-100'>
																			<h3 className="m-0 w-100">{item.names.find(name => name.language_id === languages.find(language => language.key === selectedLanguage).id).name}
																				<button onClick={() => removeFeature(index)} style={{background: "transparent", border: "none", borderRadius: "50%", float: "right"}}>
																					<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#043343" fill="none" stroke-linecap="round" stroke-linejoin="round">
																						<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
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
												<Button className="btn btn-primary w-25" style={{margin: "auto"}} onClick={() => handleAddRoom()}>Add Room</Button>
											</>
										)
									}
                            </>
						)}
						<Modal
							className="fade"
							show={showDeletePopup}
						>
							<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
								<h3 className='text-danger text-center'>Are you sure you want to delete <br /> {RoomName} Room</h3>
								<p>Note this would delete any price wrote in this hotel</p>
								<div className='d-flex gap-3'>
									<Button
										variant="dark"
										onClick={() => setShowsDeletePopup(false)}
									>
										Close
									</Button>
									<Button
										variant=""
										type="button"
										className="btn btn-danger"
										onClick={ () => handleDelete(hotelId)}
									>
										Delete
									</Button>
								</div>
							</div>
						</Modal>
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

export const TableComponent = (props) => {
	const columns = useMemo(() => props.columns, [])
	const data = useMemo(() => props.rows, [])
	const tableInstance = useTable({
		columns,
		data,
		initialState: { pageIndex: 0 }
	}, useFilters, useGlobalFilter, usePagination)

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		state,
		page,
		gotoPage,
		pageCount,
		pageOptions,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		setGlobalFilter,
	} = tableInstance


	const { globalFilter, pageIndex } = state


	return (
		<>
			{/* <PageTitle activeMenu={props.activename} motherMenu={"Hotel Details"} /> */}
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">{props.sectionname}</h4>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<div className='d-flex justify-content-between align-items-center mb-3'>
							<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
							<Button onClick={props.btnClick} class="me-2 btn btn-primary">{props.add_btn}</Button>
						</div>
						<table {...getTableProps()} className="table dataTable display">
							<thead>
								{headerGroups.map(headerGroup => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map(column => (
											<th {...column.getHeaderProps()}>
												{column.render('Header')}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()} className="" >

								{page.map((row) => {
									prepareRow(row)
									return (
										<tr {...row.getRowProps()}>
											{row.cells.map((cell) => {
												return <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
											})}
										</tr>
									)
								})}
							</tbody>
						</table>

						{
							props.rows && props.rows.length > 0 && (
								<>
									<div className="d-flex justify-content-between">
										<span>
											Page{' '}
											<strong>
												{pageIndex + 1} of {pageOptions.length}
											</strong>{''}
										</span>
										<span className="table-index">
											Go to page : {' '}
											<input type="number"
												className="ml-2"
												defaultValue={pageIndex + 1}
												onChange={e => {
													const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
													gotoPage(pageNumber)
												}}
											/>
										</span>
									</div>
									{
										pageIndex + 1 < pageOptions.length && (
											<div className="text-center mb-3">
												<div className="filter-pagination  mt-3">
													<button className=" previous-button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>

													<button className="previous-button" onClick={() => previousPage()} disabled={!canPreviousPage}>
														Previous
													</button>
													<button className="next-button" onClick={() => nextPage()} disabled={!canNextPage}>
														Next
													</button>
													<button className=" next-button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
												</div>
											</div>
										)
									}
								</>
							)
						}
						{
							!props.rows || props.rows.length == 0 && (
								<p className='fade notification alert alert-danger show text-center'>{props.notDataFoundMsg}</p>
							)
						}
					</div>
				</div>
			</div>
		</>
	)

}
export default Hotel;