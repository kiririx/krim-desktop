import React, {useEffect, useState} from "react";
import {Col, Row} from "antd";
import ObjectUtil from "../common/utils/ObjectUtil";


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

function ContactCell() {
    const icon = require("./style/icon.jpeg")
    return (<div style={{
        margin: "14px 0"
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
                        张三2
                    </label>
                </Row>
                <Row>
                    <label style={{
                    color: "#979696",
                    fontSize: "smaller"
                }}>上次开会说的事，你那边开始...
                    </label>
                </Row>
            </Col>
            <Col span={4}>
                <Row><label style={{
                    fontSize: "smaller",
                    color: "#979696"
                }}>23:12</label></Row>
                <Row></Row>
            </Col>
        </Row>
    </div>)
}

export default function Home(props: any) {

    const [friendCount, setFriendCount] = useState(20)

    useEffect(() => {
    })


    const renderEditArea = () => {
        return (<div></div>)
    }

    const renderMsgArea = () => {
        return (<div>
            <div style={{
                padding: "10px 30px",
                fontWeight: "bold"
            }}>魔法少女 (1270089850)</div>
            <div style={{
                padding: "10px 30px",
                maxHeight: "calc(100vh - 40px)",
                overflowY: "auto",
            }}>
                {ObjectUtil.forElement(<div style={{
                    padding: "20px 10px"
                }}>12121</div>, 100)}
            </div>
        </div>)
    }


    const renderChatSide = () => {
        let allCell = []
        for (let i = 0; i < friendCount; i++) {
            allCell.push(ContactCell())
        }
        return (<div style={{
            borderStyle: "ridge",
            height: "100vh",
            padding: "0 1vh"
        }}>
            {Search()}
            <div style={{
                maxHeight: "calc(100vh-20px)",
                overflowY: "auto",
            }}>
                {allCell}
            </div>
        </div>)
    }

    return (
        <div>
            <Row>
                <Col span={7}>
                    {renderChatSide()}
                </Col>
                <Col span={17}>
                    {renderMsgArea()}
                </Col>
            </Row>
        </div>
    )
}
