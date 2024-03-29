import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getChat, sendMessage } from "../../../handeApisMethods/chats";
import { url } from "../../../handeApisMethods/a-MainVariables";

const Chat = () => {
    let { id } = useParams();
    const [chat, setChat] = useState(null)
    const [currentMessage, setCurrentMessage] = useState(null)
    const handleChangeCurrentMsg = (event) => {
        setCurrentMessage(event.target.value)
    }

    const handleSendMsg = () => {
        sendMessage(id, currentMessage).then(() => {
            getChat(id).then(res => {
                setChat(res.data)    
                setCurrentMessage("")
                document.getElementById("msg_container").scrollToEnd({animated: true})
            })
        })
    }


    useEffect(() => {
        getChat(id).then(res => {
            setChat(res.data)
        })
        setInterval(() => {            
            getChat(id).then(res => {
                setChat(res.data)
            })
        }, 5000);
    }, [])
    const msgContainerRef = useRef(null);

    useEffect(() => {
        if (msgContainerRef.current) {
        msgContainerRef.current.scrollTo({
            top: msgContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
        }
    }, [chat]);
    return (
        <>
            {chat && (
                <div className="card w-100" style={{  height: "calc(100vh - 12.5rem)"}}>
                    <div className="card-head">
                        <div style={{background: "#eee", padding: 10, borderRadius: "10px 10px 0 0"}} className='d-flex justify-content-between'>
                            <div className='d-flex bd-highlight gap-2'>
                                <div className='img_cont' style={{position: 'relative'}}>
                                    <img className='rounded-circle user_img' style={{width: 50, height: 50, objectFit: "cover"}} src={chat.join_type == "Google" ? chat.picture :( chat.picture ? url + chat.picture : "../../../images/avatar/default_user.jpg")}/>
                                </div>
                                <div class="user_info">
                                    <h4 className='mb-0'>{chat.name}</h4>
                                    <p className='mb-0'>{chat.phone ? chat.phone : chat.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" id="msg_container" ref={msgContainerRef} style={{height: "100%", overflow: "auto"}}>
                        {
                            (chat && chat.messages && chat.messages.length > 0) && (
                                chat.messages.map(item => (
                                    item.is_user_sender ? (
                                        <div className="user-message" style={{display: "flex", flexDirection: "column", alignItems: "start", marginBottom: "13px"}}>
                                            <p style={{padding: "5px 10px", background: "#eee", width: "fit-content", color: "black", borderRadius: "50px", marginBottom: 0}}>
                                                {item.msg}
                                            </p>
                                            <span style={{fontSize: "10px", marginLeft: "11px"}}>
                                                {new Date(item.created_at) > new Date() - 864e5 ?
                                                new Date(item.created_at).toLocaleTimeString("en-US", { hour12: true, hour: 'numeric', minute: '2-digit' }) :
                                                String(new Date(item.created_at).getHours()).padStart(2, '0') + ':' + String(new Date(item.created_at).getMinutes()).padStart(2, '0') + ' ' + (new Date(item.created_at).getHours() >= 12 ? 'PM' : 'AM')}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="my-message" style={{display: "flex", flexDirection: "column", alignItems: "end", marginBottom: "13px"}}>
                                            <p style={{padding: "5px 10px", background: "#0e026d", width: "fit-content", color: "#fff", borderRadius: "50px", marginBottom: "0px"}}>
                                                {item.msg}
                                            </p>
                                            <span style={{marginRight: "11px", fontSize: "10px"}}>
                                                {new Date(item.created_at) > new Date() - 864e5 ?
                                                new Date(item.created_at).toLocaleTimeString("en-US", { hour12: true, hour: 'numeric', minute: '2-digit' }) :
                                                String(new Date(item.created_at).getHours()).padStart(2, '0') + ':' + String(new Date(item.created_at).getMinutes()).padStart(2, '0') + ' ' + (new Date(item.created_at).getHours() >= 12 ? 'PM' : 'AM')}
                                            </span>
                                        </div>
                                    )
                                ))
                            )
                        }
                    </div>
                    <div class="card-footer type_msg">
                        <div class="input-group d-flex align-items-center gap-2">
                            <textarea class="form-control pt-2" value={currentMessage} onChange={handleChangeCurrentMsg} placeholder="Type your message..." style={{resize: "none", borderRadius: 10}}></textarea>
                            <div class="input-group-append">
                                <button type="button" class="btn btn-primary" onClick={handleSendMsg}>
                                <i class="fa fa-location-arrow"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default Chat;