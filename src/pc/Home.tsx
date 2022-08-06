import React, {useEffect, useState} from "react";
import {Col, Modal, Row} from "antd";
import ObjectUtil from "../common/utils/ObjectUtil";
import AddContact from "./AddContact";
import WsClient from "./WsConn";
import {Notification} from "../common/component/Notification";
import WsResp from "./model/WsResp";


function Search() {
    const icon = require("./style/search.png")
    return <div>
        <Row style={{
            padding: "10px 10px",
            textAlign: "center",
            flexDirection: "column"
        }}>
            <Col>
                <div>
                    <div style={{
                        borderRadius: "5px 0 0 5px",
                        backgroundColor: "#f2f2f2",
                        padding: "3.75px",
                        display: "inline"
                    }}><img style={{
                        maxHeight: "13px"
                    }} src={icon}/></div>
                    <input style={{
                        border: "none",
                        backgroundColor: "#f2f2f2",
                        borderRadius: "0 5px 5px 0",
                        width: "88%"
                    }} placeholder={"搜索"}/>
                </div>
            </Col>
        </Row>
    </div>
}

export function ContactCell(props: {
    key: string
    senderNick: string
    message: string
    dateTime: string
}) {
    const icon = require("./style/icon.jpeg")
    const fmtMsg = props.message.length > 13 ? props.message.substring(0, 13) + "..." : props.message
    return (<div key={props.key} style={{
        margin: "3vh 0",

    }}>
        <Row>
            <Col span={5}>
                <div>
                    <img src={icon} style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "5px"
                    }}/>
                </div>
            </Col>
            <Col span={15}>
                <Row>
                    <label style={{
                        fontWeight: "bolder"
                    }}>
                        {props.senderNick}
                    </label>
                </Row>
                <Row>
                    <label style={{
                        color: "#979696",
                        fontSize: "smaller"
                    }}>{fmtMsg}
                    </label>
                </Row>
            </Col>
            <Col span={4}>
                <Row><label style={{
                    fontSize: "smaller",
                    color: "#979696"
                }}>{props.dateTime}</label></Row>
                <Row></Row>
            </Col>
        </Row>
    </div>)
}

class MessageM{
    message: string = ""
    senderNick: string = ""
    messageTime: string = ""
    id: string = ""
}

export default function Home(props: any) {

    const [addContactVisible, setAddContactVisible] = useState(false)
    const [messages, setMessages] = useState(new Array<MessageM>)

    // 监听
    const receiveMessage = (data: WsResp) => {
        Notification.success(data.message)
        messages.push({
            message: data.message,
            senderNick: data.senderNick,
            id: data.senderName,
            messageTime: data.messageTime
        })
        setMessages([...messages])
    }

    useEffect(() => {
        const clt = WsClient.Client()
        clt.addReceiveListener(receiveMessage)
    })



    const renderEditArea = () => {
        return (<div style={{
            borderStyle: "ridge",
            width: "calc(100vw - 320px)",
            height: "200px"
        }}>
            <div id={"toolbar"} style={{
                padding: "10px 0"
            }}>
                toolbar
            </div>
            <textarea style={{
                height: "160px",
                width: "100%"
            }}/>
        </div>)
    }

    const renderMsgArea = () => {
        return (<div style={{
            width: "calc(100vw - 320px)"
        }}>
            <div style={{
                padding: "10px 30px",
                fontWeight: "bold"
            }}>魔法师🧙‍ (1270089850)
            </div>
            <div style={{
                padding: "10px 30px",
                maxHeight: "calc(95vh - 40px - 200px)",
                overflowY: "auto",
            }}>
                {ObjectUtil.forElement(<div style={{
                    padding: "20px 10px"
                }}>12121</div>, 100)}
            </div>
        </div>)
    }


    const renderChatSide = () => {
        const addIcon = require("./style/addcontact.png")
        let allCell = messages.map((v) => {
            return ContactCell({
                key: v.id,
                senderNick: v.senderNick,
                dateTime: v.messageTime,
                message: v.message
            })
        })
        return (<div style={{
            borderStyle: "ridge",
            padding: "0 1vh",
            width: "300px"
        }}>
            <div style={{
                display: "flex"
            }}>
                {Search()}
                <div><img src={addIcon} onClick={() => {
                    setAddContactVisible(true)
                }}/></div>
            </div>
            <div style={{
                overflowY: "auto",
                height: "calc(95vh - 15px)"
            }}>
                {allCell}
            </div>
        </div>)
    }

    return (
        <div>
            <Row style={{
                maxHeight: "95vh"
            }}>
                <Col style={{
                    width: "300px",
                    maxHeight: "100%",
                    overflowY: "auto"
                }}>
                    {renderChatSide()}
                </Col>
                <Col style={{
                    width: "calc(100vw-340px)"
                }}>
                    <Row>
                        {renderMsgArea()}
                    </Row>
                    <Row>
                        {renderEditArea()}
                    </Row>
                </Col>
            </Row>
            <Modal visible={addContactVisible}>
                {AddContact()}
            </Modal>
        </div>
    )
}

