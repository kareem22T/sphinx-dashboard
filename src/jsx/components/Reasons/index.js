import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getReasons } from '../../../handeApisMethods/reason';
import { addReason } from '../../../handeApisMethods/reason';
import { updateReason } from '../../../handeApisMethods/reason';
import { deleteReason } from '../../../handeApisMethods/reason';
import { ToastContainer, toast } from "react-toastify";
import { getLanguages } from '../../../handeApisMethods/languages';
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

const Reasons = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [reasonKey, setReasonKey] = useState('');
	const [reasonFullName, setReasonFullName] = useState('');
	const [reasonId, setReasonId] = useState(''); // the one on edit
	const [reasons, setReasons] = useState([])
    const [icon_path, seticon_path] = useState(null)
	
	const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [names, setNames] = useState({})
    const [descriptions, setDescriptions] = useState({})

	const columns =
		[
			{
				Header: 'Icon',
				accessor: (row) => row.icon_path,
				Cell: ({ value }) => {
					return <img src={url + value} alt="Icon Thumbnail" style={{width: 50, height: 50, objectFit: "cover", borderRadius: 15, border: "1px solid white"}} />;
				},
			},
			{
				Header: 'Title',
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

	const handelShowAddReason = () => {
		setReasonId("")
		setNames({})
		seticon_path(null)
		setReasonFullName("")
		setIsEdit(false)
		setLargeModal(true)
	}
	const handleShowEdit = (reason) => {
		setReasonId(reason.id)
		let reason_names = {}
		languages.map(lang => {
			reason_names[lang.key] = reason.names.find(name => name.language_id === lang.id).name
		})
		seticon_path(null)
		setNames(reason_names)
		setIsEdit(true)
		setLargeModal(true)
	}

	const handleUpdateReason = () => {
		if (isEdit && reasonId)
			updateReason(reasonId, icon_path, names).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getReasons().then(res => {
						setReasons(res.data)
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

	const handleShowDeleteWarning = (reason) => {
		setReasonId(reason.id)
		let reason_names = {}
		languages.map(lang => {
			reason_names[lang.key] = reason.names.find(name => name.language_id === lang.id).name
		})
		seticon_path(null)
		setNames(reason_names)
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteReason(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getReasons().then(res => {
						setReasons(res.data)
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
	const handleCHangeIcon = (event) => {
		const file = event.target.files[0];
		seticon_path(file);
	};

	const handelAddReason = () => {
		addReason(icon_path, names).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getReasons().then(res => {
					setReasons(res.data)
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



	useEffect(() => {
		getLanguages().then(async res => {
			await setLanguages(res.data)
            setSelectedLanguage(res.data[0].key)
			getReasons().then(async res => {
				await setReasons(res.data)
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
									rows={reasons}
									columns={columns}
									activename="Preview"
									sectionname="Reasons"
									add_btn="Add New Reason"
									btn_press={() => handelShowAddReason()}
									notDataFoundMsg="There is no Added Reason yet!" />
								<Modal
									className="fade"
									show={showDeletePopup}
								>
									<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'max-content', width: "100%"}}>
										<h3 className='text-danger'>Are you sure you want to delete ({names["EN"] ? names["EN"] : names[selectedLanguage]}) reason</h3>
										<p>Note this would delete any price wrote in this reason</p>
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
												onClick={ () => handleDelete(reasonId)}
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
													"Edit Reason"
												) : (
													"Add New Reason"
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
											<div>
												<div class="form-group">
													<label for="formFile" class="form-label">Reason png icon</label>
													<input class="form-control" type="file" id="formFile"
														onChange={handleCHangeIcon} />
												</div>
											</div>
											<div className="d-flex gap-3 mt-3">
												<div className="w-75 form-group">
													<label for="names">Reason Title in ({selectedLanguageName})*</label>
													<input 
														type="text"
														className="form-control"
														id="names"
														placeholder="Reason title"
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
														placeholder="Hotel Description"
														value={descriptions[selectedLanguage]}
														onChange={handleChangeDescription} style={{resize: "none", paddingTop: 10}} rows={5}>
													</textarea>
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
											onClick={(isEdit && reasonId) ? () => handleUpdateReason() : () => handelAddReason()}
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
export default Reasons;