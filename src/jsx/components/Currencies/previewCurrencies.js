import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getCurrencies } from '../../../handeApisMethods/currencies';
import { addCurrency } from '../../../handeApisMethods/currencies';
import { updateCurrency } from '../../../handeApisMethods/currencies';
import { getLanguages } from '../../../handeApisMethods/languages';
import { deleteCurrency } from '../../../handeApisMethods/currencies';
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

const Currencies = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [currencyCode, setCurrencyCode] = useState('');
	const [currencyFullName, setCurrencyFullName] = useState('');
	const [currencyId, setCurrencyId] = useState(''); // the one on edit
	const [currencies, setCurrencies] = useState([])

	const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [names, setNames] = useState({})


	
    const handleChangeLang = (e) => {
        const value = e.target.value;
        setSelectedLanguage(value);
        setNames((prevState) => ({
            ...prevState,
            [value]: names[value] ? names[value] : "",
          }));
      };

	const handleChangeName = (event) => {
		setNames((prevState) => ({
			...prevState,
			[selectedLanguage]: event.target.value,
			}));
			console.log(names);
		};

	const columns =
		[
			{
				Header: 'Code',
				Footer: 'Code',
				accessor: 'code',
				Filter: ColumnFilter,
				//disableFilters: true,
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

	const handelShowAddCurrency = () => {
		setCurrencyId("")
		setCurrencyCode("")
		setNames({})
		setIsEdit(false)
		setLargeModal(true)
	}
	const handelAddCurrency = () => {
		addCurrency(currencyCode, names).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getCurrencies().then(res => {
					setCurrencies(res.data)
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

	const handleShowEdit = (currency) => {
		setCurrencyId(currency.id)
		setCurrencyCode(currency.code)
		let currency_names = {}

		languages.map(lang => {
			currency_names[lang.key] = currency.names.find(name => name.language_id === lang.id).name
		})
		setNames(currency_names)
		setIsEdit(true)
		setLargeModal(true)
	}

	const handleUpdateCurrency = () => {
		if (isEdit && currencyId)
			updateCurrency(currencyId, currencyCode, names).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getCurrencies().then(res => {
						setCurrencies(res.data)
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

	const handleShowDeleteWarning = (currency) => {
		setCurrencyId(currency.id)
		setCurrencyCode(currency.code)
		setCurrencyFullName(currency.name)
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteCurrency(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getCurrencies().then(res => {
						setCurrencies(res.data)
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
		getLanguages().then(async res => {
			await setLanguages(res.data)
            setSelectedLanguage(res.data[0].key)
			getCurrencies().then(async res => {
				await setCurrencies(res.data)
				setShowTable(true)
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
									rows={currencies}
									columns={columns}
									activename="Preview"
									sectionname="Currencies"
									add_btn="Add New Currency"
									btn_press={() => handelShowAddCurrency()}
									notDataFoundMsg="There is no Added Curruncy yet!" />
								<Modal
									className="fade"
									show={showDeletePopup}
								>
									<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'max-content' }}>
										<h3 className='text-danger'>Are you sure you want to delete {currencyFullName} currency</h3>
										<p>Note this would delete any price wrote in this currency</p>
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
												onClick={ () => handleDelete(currencyId)}
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
													"Edit Currency"
												) : (
													"Add New Currency"
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
													value={currencyCode}
													onChange={(e) => setCurrencyCode(e.target.value)}
													placeholder="Currency Code"
												/>
											</div>
											<div className="d-flex gap-3 mt-3">
											<div className="w-75 form-group">
												<label for="names">Currency Name in ({selectedLanguageName})*</label>
												<input 
													type="text"
													className="form-control"
													id="names"
													placeholder="Currency Name"
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
											onClick={(isEdit && currencyId) ? () => handleUpdateCurrency() : () => handelAddCurrency()}
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
export default Currencies;