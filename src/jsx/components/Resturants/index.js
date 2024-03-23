import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getResturants } from '../../../handeApisMethods/resturants';
import { deleteResturant } from '../../../handeApisMethods/resturants';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
// import {format} from 'date-fns';
// import { getResturant } from '../../../handeApisMethods/resturant';
import { useMemo } from 'react';
import PageTitle from "../../layouts/PageTitle";
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from '../table/FilteringTable/GlobalFilter';
import '../table/FilteringTable/filtering.css';
import { ColumnFilter } from '../table/FilteringTable/ColumnFilter';
import Loader from '../spinerLoader/loader';
import { url } from '../../../handeApisMethods/a-MainVariables';

const Resturants = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [resturantKey, setResturantKey] = useState('');
	const [resturantFullTitle, setResturantFullTitle] = useState('');
	const [resturantId, setResturantId] = useState(''); // the one on edit
	const [resturants, setResturants] = useState([])

	const columns =
		[
			{
				Header: 'Thumbnail',
				accessor: (row) => row.thumbnail,
				Cell: ({ value }) => {
					return <img src={url + value} alt="Resturant Thumbnail" style={{width: 50, height: 50, objectFit: "cover", borderRadius: 15, border: "1px solid white"}} />;
				},
			},
			{
				Header: 'Title',
				accessor: (row) => row.titles[0]["title"],
				Cell: ({ value }) => {
					return <h5 style={{margin: 0}}>{value}</h5>;
				},
			},
			{
				Header: 'Action',
				accessor: (row) => row.id, // Or unique identifier from your data
				Cell: ({ row }) => (
					<>
						<Link className='btn-sm btn m-2 btn-success' to={"/resturant/edit/" + row.original.id}><i class="fas fa-pencil-alt"></i></Link>
						<button className='btn-sm btn btn-danger' onClick={() => handleShowDeleteWarning(row.original)}><i class="fas fa-trash"></i></button>
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

	const handleShowDeleteWarning = (resturant) => {
		setResturantId(resturant.id)
		setResturantKey(resturant.key)
		setResturantFullTitle(resturant.titles[0]["title"])
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteResturant(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getResturants().then(res => {
						setResturants(res.data)
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
		getResturants().then(async res => {
			await setResturants(res.data)
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
							<TableComponent
								rows={resturants}
								columns={columns}
								activename="Preview"
								sectionname="Resturants"
								add_btn="Add New Resturant"
								notDataFoundMsg="There is no Added Resturant yet!" />
						)}
						<Modal
							className="fade"
							show={showDeletePopup}
						>
							<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
								<h3 className='text-danger text-center'>Are you sure you want to delete <br /> {resturantFullTitle} resturant</h3>
								<p>Note this would delete any price wrote in this resturant</p>
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
										onClick={ () => handleDelete(resturantId)}
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
			<PageTitle activeMenu={props.activename} motherMenu={props.sectionname} />
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">{props.sectionname}</h4>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<div className='d-flex justify-content-between align-items-center mb-3'>
							<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
							<Link className='btn btn-primary' to={"/create-resturant"} >
								{props.add_btn}
							</Link>
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
export default Resturants;