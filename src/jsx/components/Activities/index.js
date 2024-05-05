import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getActivities } from '../../../handeApisMethods/activities';
import { addActivity } from '../../../handeApisMethods/activities';
import { updateActivity } from '../../../handeApisMethods/activities';
import { getLanguages } from '../../../handeApisMethods/languages';
import { deleteActivity } from '../../../handeApisMethods/activities';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {format} from 'date-fns';
import { useMemo } from 'react';
import PageTitle from "../../layouts/PageTitle";
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from '../table/FilteringTable/GlobalFilter';
import '../table/FilteringTable/filtering.css';
import { ColumnFilter } from '../table/FilteringTable/ColumnFilter';
import Loader from '../spinerLoader/loader';
import { url } from '../../../handeApisMethods/a-MainVariables';

const Activities = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [activityCode, setActivityCode] = useState('');
	const [activityFullName, setActivityFullName] = useState('');
	const [activityId, setActivityId] = useState(''); // the one on edit
	const [activities, setActivities] = useState([])
	const [thumbnail, setThumbnail] = useState(null)
	const [thumbnailOld, setThumbnailOld] = useState(null)
	const [showLoader, setShowLoader] = useState(false)


    const [name_en, setName_en] = useState()
    const [name_ar, setName_ar] = useState()
    const [desc_ar, setDesc_ar] = useState()
    const [desc_en, setDesc_en] = useState()

    const handleChangeNameEn = (event) => {
        setName_en(event.target.value)
    }

    const handleChangeNameAr = (event) => {
        setName_ar(event.target.value)
    }
    const handleChangeDescAr = (event) => {
        setDesc_ar(event.target.value)
    }
    const handleChangeDescEn = (event) => {
        setDesc_en(event.target.value)
    }
	const handleChangeResturantThumbnail = (event) => {
		setThumbnail(event.target.files[0])
	  }
		
	const columns =
		[
			{
				Header: 'Name',
				Footer: 'Name',
				accessor: 'name_en',
				Filter: ColumnFilter,
				//disableFilters: true,
			},
			{
				Header: 'Action',
				accessor: (row) => row.id, // Or unique identifier from your data
				Cell: ({ row }) => (
					<>
						<button className='btn-sm btn btn-success' onClick={() => handleShowEdit(row.original)}><i class="fas fa-pencil-alt"></i></button>
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

	const handelShowAddActivity = () => {
		setActivityId("")
		setActivityCode("")
		setIsEdit(false)
		setLargeModal(true)
	}
	const handelAddActivity = () => {
		setShowLoader(true)
		addActivity(name_en, name_ar, desc_ar, desc_en, thumbnail).then(res => {
			setShowLoader(false)
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getActivities().then(res => {
					setActivities(res.data)
					setLargeModal(false)
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

	const handleShowEdit = (activity) => {
		setActivityId(activity.id)
		setName_en(activity.name_en)
		setName_ar(activity.name_ar)
		setDesc_en(activity.desc_en)
		setDesc_ar(activity.desc_ar)
		setThumbnailOld(activity.thumbnail_path ? activity.thumbnail_path : null)
		setIsEdit(true)
		setLargeModal(true)
	}

	const handleUpdateActivity = () => {
		setShowLoader(true)
		if (isEdit && activityId)
			setShowLoader(false)
			updateActivity(activityId, name_en, name_ar, desc_ar, desc_en, thumbnail).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getActivities().then(res => {
						setActivities(res.data)
						setLargeModal(false)
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

	const handleShowDeleteWarning = (activity) => {
		setActivityId(activity.id)
		setName_en(activity.name_en)
		setName_ar(activity.name_ar)
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteActivity(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getActivities().then(res => {
						setActivities(res.data)
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


	useEffect(() => {
        getActivities().then(async res => {
            await setActivities(res.data)
            setShowTable(true)
        })
	}, []);



	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<ToastContainer>
					</ToastContainer>
					<div className="row">
						{showTable && (
							<>
								<TableComponent
									rows={activities}
									columns={columns}
									activename="Preview"
									sectionname="Activities"
									add_btn="Add New Activity"
									btn_press={() => handelShowAddActivity()}
									notDataFoundMsg="There is no Added Activity yet!" />
								<Modal
									className="fade"
									show={showDeletePopup}
								>
									<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'max-content' }}>
										<h3 className='text-danger'>Are you sure you want to delete {name_en} Activity</h3>
										<p>Note this would delete any price wrote in this Activity</p>
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
												onClick={ () => handleDelete(activityId)}
											>
												Delete
											</Button>
										</div>
									</div>
								</Modal>
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
												isEdit ? (
													"Edit Activity"
												) : (
													"Add New Activity"
												)
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
										<div className='row'>
											<div className="d-flex gap-3 mt-3">
											<div className="w-50 form-group">
												<div className="w-100 form-group">
													<label for="names">Activity Name in English*</label>
													<input 
														type="text"
														className="form-control"
														id="names"
														placeholder="Activity Name in English"
														value={name_en}
														onChange={handleChangeNameEn} />
												</div>
												<div className="w-100 form-group mt-3">
													<label for="names">Activity Name in Arabic*</label>
													<input 
														type="text"
														className="form-control"
														id="names"
														placeholder="Activity Name in Arabic"
														value={name_ar}
														onChange={handleChangeNameAr} />
												</div>
												<div className="w-100 form-group mt-3">
													<label for="names">Activity Description in English*</label>
													<input 
														type="text"
														className="form-control"
														id="names"
														placeholder="Activity description in English"
														value={desc_en}
														onChange={handleChangeDescEn} />
												</div>
												<div className="w-100 form-group mt-3">
													<label for="names">Activity Description in Arabic*</label>
													<input 
														type="text"
														className="form-control"
														id="names"
														placeholder="Activity description in Arabic"
														value={desc_ar}
														onChange={handleChangeDescAr} />
												</div>
											</div>
											<div className='w-50 card p-3 d-flex justify-content-center align-items-center m-0'> 
												<label htmlFor={"resturant"} class="w-100">
													{
														(!thumbnail && !thumbnailOld) && (
															<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo-up w-100" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" style={{width: '200px', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} stroke="#043343" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
														(thumbnail) && (
															<img src={URL.createObjectURL(thumbnail)} style={{width: '100%', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} alt={"thumbnail"} />
														)
													}
													{
														(thumbnailOld && !thumbnail) && (
															<img src={url + thumbnailOld} style={{width: '100%', height: '210px', objectFit: 'cover', padding: '10px', border: '1px solid', borderRadius: '1rem'}} alt={"thumbnail"} />
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
											onClick={(isEdit && activityId) ? () => handleUpdateActivity() : () => handelAddActivity()}
										>
											{
												isEdit ? (
													"Update"
												) : (
													"Create"
												)
											}
										</Button>
									</Modal.Footer>
								</Modal>
							</>
						)}
						{
							!showTable && (
								<Loader />
							)
						}
						{
                            showLoader && ( 
                                <div className='mainLoader' style={{ zIndex: 999999999, width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.57)'}} >
                                    <Loader style={{margin: 0}}></Loader>
                                </div>
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
			<PageTitle activeMenu={props.activename} motherMenu={props.sectionname} />
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">{props.sectionname}</h4>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<div className='d-flex justify-content-between align-items-center mb-3'>
							<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
							<button type="button" class="me-2 btn btn-primary" onClick={props.btn_press}>{props.add_btn}</button>
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
export default Activities;