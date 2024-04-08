import { useEffect, useMemo, useState } from 'react';
import PageTitle from "../../layouts/PageTitle";
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import Loader from '../spinerLoader/loader';
import { getChats } from '../../../handeApisMethods/chats';
import { url } from '../../../handeApisMethods/a-MainVariables';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
apiKey: "AIzaSyBvtr0-110NmwxMglyECyUMvcFdfYv-r-U",
authDomain: "sphinx-travel-d17f5.firebaseapp.com",
projectId: "sphinx-travel-d17f5",
storageBucket: "sphinx-travel-d17f5.appspot.com",
messagingSenderId: "1079146169511",
appId: "1:1079146169511:web:a0c58e5cd0b2d9ea4a0782",
// measurementId: "G-X5MLC4QH67" // Remove if not using Analytics
};

// Initialize Firebase and get messaging instance
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const Chats = () => {
    const [chats, setChats] = useState([])
    const [showTable, setShowTable] = useState(false);
      
    const columns =
        [
            {
                Header: 'User',
                accessor: (row) => row,
                Cell: ({ value }) => {
                    return (
                        <>
                            <div style={{background: "#eee", padding: 10, borderRadius: 5}} className='d-flex justify-content-between'>
                                <div className='d-flex bd-highlight gap-2'>
                                    <div className='img_cont' style={{position: 'relative'}}>
                                        <img className='rounded-circle user_img' style={{width: 50, height: 50, objectFit: "cover"}} src={value.join_type == "Google" ? value.picture :( value.picture ? url + value.picture : "../../../images/avatar/default_user.jpg")}/>
                                        {
                                            value.messages.filter(message => !message.seen).length > 0 && (
                                                <span style={{position: "absolute", minWidth: 20,textAlign: 'center', bottom: 0, right: 0, background: "red", padding: "2px 4px", borderRadius: "5px", lineHeight: "16px", color: 'white', fontSize: "12px"}}>{value.messages.filter(message => !message.seen).length}</span>
                                            )
                                        }
                                    </div>
                                    <div class="user_info">
                                        <h4 className='mb-0'>{value.name}</h4>
                                        <p className='mb-0'>{value.phone ? value.phone : value.email}</p>
                                    </div>
                                </div>
                                <a href={`/Admin/Chats/chat/${value.id}`} className='btn btn-primary'>Chat Now</a>
                            </div>
                        </>
                    );
                },
            },
        ]

    useEffect(() => {
        getChats().then(res => {
            setChats(res.data)
            setShowTable(true)
        })
        setInterval(() => {            
            getChats().then(res => {
                setChats(res.data)
                setShowTable(true)
            })
        }, 60000);
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row">
                        {showTable && (
                            <>

                                <TableComponent
                                    rows={chats}
                                    columns={columns}
                                    activename="Preview"
                                    sectionname="Latest Chats"
                                    add_btn="Add New Request"
                                    notDataFoundMsg="There is no chats yet!"
                                />
                            </>
                        )
                        }
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
    const [columns, setColumns] = useState(props.columns)
    const [data, setData] = useState(props.rows)
    setInterval(() => {
        setData(props.rows)
    }, 4000);

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

export default Chats;