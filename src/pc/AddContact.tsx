import {Col, Row} from "antd";
import React, {useState} from "react";
import HttpClient from "../common/component/HttpClient";

export default function AddContact() {

    const [searchKey, setSearchKey] = useState("")
    const [contact, setContact] = useState({
        userId: 0,
        username: "",
        nickname: "",
        sex: ""
    })

    return <div>
        <div>
            <input onChange={e => {
                setSearchKey(e.target.value)
            }}/>
            <button onClick={() => {
                if (searchKey != "") {
                    const url = "/contact/" + searchKey
                    HttpClient.get(url, resp => {
                        setContact({
                            userId: resp.data.user_id,
                            nickname: resp.data.nickname,
                            username: resp.data.username,
                            sex: resp.data.sex
                        })
                    })
                }
            }}>search
            </button>
        </div>
        <div>
            <div>
                {ContactCell({
                    userId: contact.userId,
                    username: contact.username,
                    nickname: contact.nickname,
                    sex: contact.sex
                })}
            </div>
        </div>
    </div>
}

function ContactCell(props: {
    userId: number
    username: string
    nickname: string
    sex?: string
}) {
    const icon = require("./style/icon.jpeg")
    const addIcon = require("./style/addcontact.png")
    return (<div style={{
        margin: "3vh 0"
    }}>
        <Row>
            <Col span={3}>
                <div>
                    <img src={icon} style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "5px"
                    }}/>
                </div>
            </Col>
            <Col span={19}>
                <Row>
                    <label style={{
                        fontWeight: "bolder"
                    }}>
                        {props.nickname} ({props.username})
                    </label>
                </Row>
            </Col>
            <Col span={2}>
                <img src={addIcon} onClick={() => {
                    const url = "/contact/addUser"
                    HttpClient.post(url, {
                        target_id: props.userId,
                        event_type: 0
                    }, () => {
                    })
                }}/>
            </Col>
        </Row>
    </div>)
}