import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { approve, getRequests, getRequestsNew, seen, cancel } from '../../../handeApisMethods/requests';
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
	const [currentReq, setCurrentReq] = useState()
	const [currentApprovingMsg, setCurrentApprovingMsg] = useState()
	const [showApprovingModal, setShowApprovingModal] = useState(false)
	const [showCancelModal, setShowCancelModal] = useState(false)
	const [currentCancelMsg, setCurrentCancelMsg] = useState()

	const handleApproving = () => {
		approve(currentReq.id).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getRequests().then(res => {
					getRequestsNew().then(res => {
						setNewRequests(res.data)
					})
					setRequests(res.data)
					setShowApprovingModal(false)
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

	const handleCancel = () => {
		cancel(currentReq.id).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getRequests().then(res => {
					setRequests(res.data)
					setShowCancelModal(false)
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

	const handleShowApprovingMsg = (req, status) => {
		setCurrentReq(req)
		setCurrentApprovingMsg("Are you sure you want to " + (status === 1 ? "Confirm " : "Complete ") + req.user.name + " request")
		setShowApprovingModal(true)
	}

	const handleShowCancelMsg = (req, status) => {
		setCurrentReq(req)
		setCurrentCancelMsg("Are you sure you want to Cancel " + req.user.name + " request")
		setShowCancelModal(true)
	}

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
                                <div style={{display: "flex",height: "min-content", alignItems: 'center', position: "relative"}}>
                                    <img src={value.user.join_type == "Google" ? value.user.picture : (value.user.picture ? value.user.picture : "../../../images/default_user.jpg")} style={{width: "90px",height: "90px", borderRadius: "10px"}}/>
									<span style={{position: 'absolute', bottom: -10, fontSize: '11px', whiteSpace: 'nowrap', padding: '3px 8px', background: parseInt(value.status) === 1 ? '#0e026d' : (parseInt(value.status) === 2 ? "#4885ed" : (parseInt(value.status) === 3 ? "#68e365" : (parseInt(value.status) === 4 ? "#e23428" : "#787878"))), color: 'white', borderRadius: '5px', left: "50%", transform: "translateX(-50%)"}}>
										{parseInt(value.status) === 1 ? "Under Review" : (parseInt(value.status) === 2 ? "Booking Confirmd" : (parseInt(value.status) === 3 ? "Completed" : (parseInt(value.status) === 4 ? "Uncompleted" : "Undefiened")))}
									</span>
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
                                <div style={{width: "70%", display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", justifyContent: "center"}}>
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
                                    <div  style={{width: "100%", fontSize: 12}}>
										{(data.more && data.more != "----") && (
											"Additional Info:" + data.more
										)}
                                    </div>
                                <div style={{display: "flex", flexDirection: "column", gap: 10, width: "100%", alignItems: "end"}}>
									<div className='w-100 d-flex gap-2'>
										{
											(parseInt(value.status) === 1 || parseInt(value.status) === 2) && (
												<button className='btn btn-secondary w-100' onClick={() => handleShowApprovingMsg(value, parseInt(value.status))}>
													{parseInt(value.status) === 1 ? "Confirm" : (parseInt(value.status) === 2 ? "Complete" : "")}
												</button>
											)
										}
										{
											parseInt(value.status) !== 4 &&  parseInt(value.status) !== 3 && (
												<button className='btn btn-danger w-100' onClick={() => handleShowCancelMsg(value, parseInt(value.status))}>
													Cancel
												</button>
											)
										}
										{
											parseInt(value.status) === 3 && (
												<span className='btn bg-success text-white w-100' style={{cursor: "none"}}>
													Completed!
												</span>
											)
										}
										{
											parseInt(value.status) === 4 && (
												<span  className='btn bg-danger text-white w-100' style={{cursor: "none"}}>
													Canceled!
												</span>
											)
										}
									</div>
                                    {/* <button className='btn btn-secondary' style={{width: 150}} onClick={ () => handleShowEditStatus(value)}>Edit Status</button> */}
                                    <a href={`/Admin/Chats/chat/${value.user.id}`}  className='btn btn-dark w-100' style={{width: 150}}>Chat With User</a>
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

	useEffect(() => {
		getRequests().then(async res => {
			setRequests(res.data)
            getRequestsNew().then(res => {
                setNewRequests(res.data)
                seen()
                setShowTable(true)
            })
		})
		setInterval(() => {            
			getRequests().then(async res => {
				setRequests(res.data)
				getRequestsNew().then(res => {
					setNewRequests(res.data)
					seen()
					setShowTable(false)
					setInterval(() => {
						setShowTable(true)
					}, 1000);
				})
			})
        }, 60000);

	}, []);

	const [currentRequest, setCurrentRequest] = useState()
	const [showModalEdit, setShowModalEdit] = useState()

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
								notDataFoundMsg="There is New Request yet!" 
                                />
                                
                            <TableComponent
								rows={requests}
								columns={columns}
								activename="Preview"
								sectionname="All Requests"
								add_btn="Add New Request"
								notDataFoundMsg="There is no Request yet!" />

								<Modal
									className="fade"
									show={showApprovingModal}
								>
									<div role="alert" class="fade notification alert show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
										<h3 className='text-center'>{currentApprovingMsg}</h3>
										<div className='d-flex gap-3'>
											<Button
												variant="dark"
												onClick={() => setShowApprovingModal(false)}
											>
												Close
											</Button>
											<Button
												variant=""
												type="button"
												className="btn btn-success"
												onClick={ () => handleApproving()}
											>
												Confirm
											</Button>
										</div>
									</div>
								</Modal>
								<Modal
									className="fade"
									show={showCancelModal}
								>
									<div role="alert" class="fade notification alert show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
										<h3 className='text-center'>{currentCancelMsg}</h3>
										<div className='d-flex gap-3'>
											<Button
												variant="dark"
												onClick={() => setShowCancelModal(false)}
											>
												Close
											</Button>
											<Button
												variant=""
												type="button"
												className="btn btn-danger"
												onClick={ () => handleCancel()}
											>
												Cancel
											</Button>
										</div>
									</div>
								</Modal>
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