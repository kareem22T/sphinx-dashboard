import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getRequests, getRequestsNew, seen } from '../../../handeApisMethods/requests';
import { addRequest } from '../../../handeApisMethods/requests';
import { updateRequest } from '../../../handeApisMethods/requests';
import { deleteRequest } from '../../../handeApisMethods/requests';
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

const Requests = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [requestKey, setRequestKey] = useState('');
	const [requestFullName, setRequestFullName] = useState('');
	const [requestId, setRequestId] = useState(''); // the one on edit
	const [requests, setRequests] = useState([])
	const [newRequests, setNewRequests] = useState([])

	const columns =
		[
			{
				Header: ' ',
				accessor: (row) => row,
				Cell: ({ value }) => {
                    let data = JSON.parse(value.booking_details)
					return (
                        <>
                            <div style={{display: "flex",gap: "1.5rem", borderBottom: "1px solid gray", paddingBottom: 20}}>
                                <div style={{display: "flex", alignItems: 'center'}}>
                                    <img src={value.user.join_type == "Google" ? value.user.picture : (value.user.picture ? value.user.picture : "../../../images/default_user.jpg")} style={{width: "90px",height: "90px", borderRadius: "10px"}}/>
                                </div>
                                <div style={{width: "100%"}}>
                                    {
                                        data.type == "hotel" && (
                                            <>
                                                <h4>Hotel: {data.hotel}, <span>{data.room}</span></h4>
                                                <p style={{marginBottom: 0}}>Persons: {data.persons}</p>
                                                <div style={{
                                                    display: "flex",
                                                    gap: 10,
                                                    fontSize: 12,
                                                    marginBottom: 0
                                                }}>
                                                    <p className='m-0'>From: {data.from}</p>
                                                    <p className='m-0'>To: {data.to}</p>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    gap: 10,
                                                    fontSize: 12,
                                                    marginBottom: 0
                                                }}>
                                                    <p className='m-0'>Room Price: {data.price}</p>
                                                </div>
                                            </>
                                        )
                                    }
                                    {
                                        data.type == "tour" && (
                                            <>
                                                <h4 style={{maxWidth: "250px"}}>Tour: {data.tour}, <span>{data.package}</span></h4>
                                                <p style={{marginBottom: 0}}>Persons: {data.persons}</p>
                                                <div style={{
                                                    display: "flex",
                                                    gap: 10,
                                                    fontSize: 12,
                                                    marginBottom: 0
                                                }}>
                                                    <p className='m-0'>Suggest Starts: {data.start}</p>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    gap: 10,
                                                    fontSize: 12,
                                                    marginBottom: 0
                                                }}>
                                                    <p className='m-0'>Price Per Person: {data.price}</p>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                                <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", justifyContent: "center"}}>
                                    <span style={{display: "flex", gap: 10}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-call" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                            <path d="M15 7a2 2 0 0 1 2 2" />
                                            <path d="M15 3a6 6 0 0 1 6 6" />
                                        </svg>
                                        {data.phone}
                                    </span>
                                    <span style={{display: "flex", gap: 10}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-square-rounded" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z" />
                                            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                                            <path d="M6 20.05v-.05a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v.05" />
                                        </svg>
                                        {value.user.name}
                                    </span>
                                    <span style={{display: "flex", gap: 10}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                            <path d="M3 7l9 6l9 -6" />
                                        </svg>
                                        {value.user.email}
                                    </span>
                                </div>
                                {(data.more && data.more != "----") && (
                                    <div  style={{width: "100%"}}>
                                        Additional Info: {data.more}
                                    </div>
                                )}
                                <div style={{display: "flex", flexDirection: "column", gap: 10, width: "100%", alignItems: "end"}}>
                                    <button className='btn btn-secondary' style={{width: 150}}>Edit Status</button>
                                    <button className='btn btn-success' style={{width: 150}}>Chat With User</button>
                                </div>
                            </div>
                        </>
                    );
				},
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

	const handelShowAddRequest = () => {
		setRequestId("")
		setRequestKey("")
		setRequestFullName("")
		setIsEdit(false)
		setLargeModal(true)
	}
	const handelAddRequest = () => {
		addRequest(requestKey, requestFullName).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getRequests().then(res => {
					setRequests(res.data)
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

	const handleShowEdit = (request) => {
		setRequestId(request.id)
		setRequestKey(request.key)
		setRequestFullName(request.name)
		setIsEdit(true)
		setLargeModal(true)
	}

	const handleUpdateRequest = () => {
		if (isEdit && requestId)
			updateRequest(requestId, requestKey, requestFullName).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getRequests().then(res => {
						setRequests(res.data)
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

	const handleShowDeleteWarning = (request) => {
		setRequestId(request.id)
		setRequestKey(request.key)
		setRequestFullName(request.name)
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteRequest(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getRequests().then(res => {
						setRequests(res.data)
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
		getRequests().then(async res => {
			setRequests(res.data)
            getRequestsNew().then(res => {
                setNewRequests(res.data)
                seen()
                setShowTable(true)
            })
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
								rows={newRequests}
								columns={columns}
								activename="Preview"
								sectionname="New Requests"
								add_btn="Add New Request"
								btn_press={() => handelShowAddRequest()}
								notDataFoundMsg="There is New Request yet!" 
                                />
                                
                            <TableComponent
								rows={requests}
								columns={columns}
								activename="Preview"
								sectionname="All Requests"
								add_btn="Add New Request"
								btn_press={() => handelShowAddRequest()}
								notDataFoundMsg="There is no Request yet!" />
                            </>
						)}
						<Modal
							className="fade"
							show={showDeletePopup}
						>
							<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'max-content' }}>
								<h3 className='text-danger'>Are you sure you want to delete {requestFullName} request</h3>
								<p>Note this would delete any price wrote in this request</p>
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
										onClick={ () => handleDelete(requestId)}
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
											"Edit Request"
										) : (
											"Add New Request"
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
									<div className='col-sm-6'>
										<input type="text" className="form-control"
											value={requestKey}
											onChange={(e) => setRequestKey(e.target.value)}
											placeholder="Request Key in English"
										/>
									</div>
									<div className='col-sm-6 mt-2 mt-sm-0'>
										<input type="text" className="form-control"
											value={requestFullName}
											onChange={(e) => setRequestFullName(e.target.value)}
											placeholder="Request Full Name"
										/>
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
									onClick={(isEdit && requestId) ? () => handleUpdateRequest() : () => handelAddRequest()}
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
			<PageTitle activeMenu={props.activename} motherMenu={props.sectionname} />
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">{props.sectionname}</h4>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<table {...getTableProps()} className="table dataTable display">
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
export default Requests;