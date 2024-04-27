import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getDestinations } from '../../../handeApisMethods/destinations';
import { addDestination } from '../../../handeApisMethods/destinations';
import { updateDestination } from '../../../handeApisMethods/destinations';
import { getLanguages } from '../../../handeApisMethods/languages';
import { deleteDestination } from '../../../handeApisMethods/destinations';
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

const Destinations = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [destinationCode, setDestinationCode] = useState('');
	const [destinationFullName, setDestinationFullName] = useState('');
	const [destinationId, setDestinationId] = useState(''); // the one on edit
	const [destinations, setDestinations] = useState([])

    const [name_en, setName_en] = useState()
    const [name_ar, setName_ar] = useState()

    const handleChangeNameEn = (event) => {
        setName_en(event.target.value)
    }

    const handleChangeNameAr = (event) => {
        setName_ar(event.target.value)
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

	const handelShowAddDestination = () => {
		setDestinationId("")
		setDestinationCode("")
		setIsEdit(false)
		setLargeModal(true)
	}
	const handelAddDestination = () => {
		addDestination(name_en, name_ar).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getDestinations().then(res => {
					setDestinations(res.data)
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

	const handleShowEdit = (destination) => {
		setDestinationId(destination.id)
		setName_en(destination.name_en)
		setName_ar(destination.name_ar)
		setIsEdit(true)
		setLargeModal(true)
	}

	const handleUpdateDestination = () => {
		if (isEdit && destinationId)
			updateDestination(destinationId, name_en, name_ar).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getDestinations().then(res => {
						setDestinations(res.data)
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

	const handleShowDeleteWarning = (destination) => {
		setDestinationId(destination.id)
		setName_en(destination.name_en)
		setName_ar(destination.name_ar)
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteDestination(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getDestinations().then(res => {
						setDestinations(res.data)
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
        getDestinations().then(async res => {
            await setDestinations(res.data)
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
									rows={destinations}
									columns={columns}
									activename="Preview"
									sectionname="Destinations"
									add_btn="Add New Destination"
									btn_press={() => handelShowAddDestination()}
									notDataFoundMsg="There is no Added Destination yet!" />
								<Modal
									className="fade"
									show={showDeletePopup}
								>
									<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'max-content' }}>
										<h3 className='text-danger'>Are you sure you want to delete {name_en} destination</h3>
										<p>Note this would delete any price wrote in this destination</p>
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
												onClick={ () => handleDelete(destinationId)}
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
													"Edit Destination"
												) : (
													"Add New Destination"
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
												<label for="names">Destination Name in English*</label>
												<input 
													type="text"
													className="form-control"
													id="names"
													placeholder="Destination Name in English"
													value={name_en}
													onChange={handleChangeNameEn} />
											</div>
											<div className="w-50 form-group">
												<label for="names">Destination Name in Arabic*</label>
												<input 
													type="text"
													className="form-control"
													id="names"
													placeholder="Destination Name in Arabic"
													value={name_ar}
													onChange={handleChangeNameAr} />
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
											onClick={(isEdit && destinationId) ? () => handleUpdateDestination() : () => handelAddDestination()}
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
export default Destinations;