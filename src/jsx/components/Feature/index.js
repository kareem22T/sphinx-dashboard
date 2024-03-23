import React, { useContext, useEffect, useState } from 'react';
// import TableComponent from "./../table/FilteringTable/FilteringTable" 
import { Button, Modal } from "react-bootstrap";
import { getFeatures } from '../../../handeApisMethods/feature';
import { addFeature } from '../../../handeApisMethods/feature';
import { updateFeature } from '../../../handeApisMethods/feature';
import { deleteFeature } from '../../../handeApisMethods/feature';
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

const Features = () => {
	const [largeModal, setLargeModal] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [showDeletePopup, setShowsDeletePopup] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [featureKey, setFeatureKey] = useState('');
	const [featureFullName, setFeatureFullName] = useState('');
	const [featureId, setFeatureId] = useState(''); // the one on edit
	const [features, setFeatures] = useState([])
    const [icon_path, seticon_path] = useState(null)
	
	const [languages, setLanguages] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageName, setSelectedLanguageName] = useState('');
    const [names, setNames] = useState({})

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

	const handelShowAddFeature = () => {
		setFeatureId("")
		setNames({})
		seticon_path(null)
		setFeatureFullName("")
		setIsEdit(false)
		setLargeModal(true)
	}
	const handleShowEdit = (feature) => {
		setFeatureId(feature.id)
		let feature_names = {}
		languages.map(lang => {
			feature_names[lang.key] = feature.names.find(name => name.language_id === lang.id).name
		})
		seticon_path(null)
		setNames(feature_names)
		setIsEdit(true)
		setLargeModal(true)
	}

	const handleUpdateFeature = () => {
		if (isEdit && featureId)
			updateFeature(featureId, icon_path, names).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getFeatures().then(res => {
						setFeatures(res.data)
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

	const handleShowDeleteWarning = (feature) => {
		setFeatureId(feature.id)
		let feature_names = {}
		languages.map(lang => {
			feature_names[lang.key] = feature.names.find(name => name.language_id === lang.id).name
		})
		seticon_path(null)
		setNames(feature_names)
		setShowsDeletePopup(true)
	}

	const handleDelete = (id) => {
		if (id) {
			deleteFeature(id).then(res => {
				if (res.data.status === true) {
					notifyTopRight(res.data.message)
					getFeatures().then(res => {
						setFeatures(res.data)
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
      };

	const handleChangeName = (event) => {
		setNames((prevState) => ({
			...prevState,
			[selectedLanguage]: event.target.value,
			}));
			console.log(names);
		};

	const handleCHangeIcon = (event) => {
		const file = event.target.files[0];
		seticon_path(file);
	};

	const handelAddFeature = () => {
		addFeature(icon_path, names).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getFeatures().then(res => {
					setFeatures(res.data)
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
			getFeatures().then(async res => {
				await setFeatures(res.data)
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
									rows={features}
									columns={columns}
									activename="Preview"
									sectionname="Features"
									add_btn="Add New Feature"
									btn_press={() => handelShowAddFeature()}
									notDataFoundMsg="There is no Added Feature yet!" />
								<Modal
									className="fade"
									show={showDeletePopup}
								>
									<div role="alert" class="fade notification alert alert-danger show m-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'max-content', width: "100%"}}>
										<h3 className='text-danger'>Are you sure you want to delete ({names["EN"] ? names["EN"] : names[selectedLanguage]}) feature</h3>
										<p>Note this would delete any price wrote in this feature</p>
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
												onClick={ () => handleDelete(featureId)}
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
										<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-adjustments-star" className='mr-2' width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
											<path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
											<path d="M6 4v4" />
											<path d="M6 12v8" />
											<path d="M12 4v9.5" />
											<path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
											<path d="M18 4v1" />
											<path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" />
											<path d="M18 9v1" />
										</svg>
											{
												isEdit ? (
													"Edit Feature"
												) : (
													"Add New Feature"
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
													<label for="formFile" class="form-label">Feature png icon</label>
													<input class="form-control" type="file" id="formFile"
														onChange={handleCHangeIcon} />
												</div>
											</div>
											<div className="d-flex gap-3 mt-3">
												<div className="w-75 form-group">
													<label for="names">Feature Title in ({selectedLanguageName})*</label>
													<input 
														type="text"
														className="form-control"
														id="names"
														placeholder="Feature title"
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
											onClick={(isEdit && featureId) ? () => handleUpdateFeature() : () => handelAddFeature()}
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
export default Features;