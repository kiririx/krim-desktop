import React from "react";
import css from "./style/login.module.css"
import {Button, Checkbox, Col, Input, Modal, Row} from "antd";
import BlankRow from "./component/BlankRow";
import {Notification} from "../common/component/Notification";
import StringUtil from "../common/utils/StringUtil";
import ObjectUtil from "../common/utils/ObjectUtil";
import HttpClient from "../common/component/HttpClient";
import HttpURL from "../common/env/HttpURL";
import RouterUtil from "../common/utils/RouterUtil";
import RouterURL from "../common/env/RouterURL";
import WsClient from "./WsConn";

const STATUS = {
    "LOGIN": 0,
    "REGISTER": 1
}

class RegForm {
    username = ""
    password = ""
    rePassword = ""
}

class LoginForm {
    username = ""
    password = ""
}

class State {
    regVisible = false
    regForm = new RegForm()
    loginForm = new LoginForm()
    autoLogin = false
    remember = false
}

class Props {

}

export class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = new State()
    }

    private ui_register = {
        doOpen: () => {
            this.setState({
                regVisible: true
            })
        },
        doClear: () => {
            this.setState({
                regForm: {
                    username: "",
                    password: "",
                    rePassword: ""
                }
            })
        },
        doClose: () => {
            this.setState({
                regVisible: false
            })
            this.ui_register.doClear()
        },
        doValidate: (onBlank: () => void, onPasswdNotEqual: () => void) => {
            const validateFields = ["username", "password", "rePassword"]
            let key: keyof RegForm
            for (key in this.state.regForm) {
                if (validateFields.indexOf(key) > -1 && StringUtil.isBlank(this.state.regForm[key])) {
                    onBlank()
                    return false
                }
            }
            if (this.state.regForm.password !== this.state.regForm.rePassword) {
                onPasswdNotEqual()
                return false
            }
            return true
        },
        doOk: () => {
            const pass = this.ui_register.doValidate(() => {
                Notification.error("????????????????????????")
            }, () => {
                Notification.error("????????????????????????")
            })
            if (pass) {
                HttpClient.post(HttpURL.POST_REGISTER, {
                    username: this.state.regForm.username,
                    password: this.state.regForm.password
                }, resp => {
                    Notification.success("??????????????????????????????")
                    this.ui_register.doClose()
                }, err => {
                    if (err)
                        Notification.error("???????????????")
                })
            }
        },
        render: () => {
            return <div>
                <Modal visible={this.state.regVisible} onCancel={this.ui_register.doClose} onOk={this.ui_register.doOk}>
                    <div className={css.regModal}>
                        <Row>
                            <Col span={4}>??????</Col>
                            <Col span={20}>
                                <Input value={this.state.regForm.username} onChange={(val) => {
                                    this.setState({regForm: ObjectUtil.getNewProperty(this.state, "regForm.username", val.target.value)})
                                }}></Input>
                            </Col>
                        </Row>
                        <BlankRow/>
                        <Row>
                            <Col span={4}>??????</Col>
                            <Col span={20}>
                                <Input.Password value={this.state.regForm.password} onChange={(val) => {
                                    this.setState({regForm: ObjectUtil.getNewProperty(this.state, "regForm.password", val.target.value)})
                                }}></Input.Password>
                            </Col>
                        </Row>
                        <BlankRow/>
                        <Row>
                            <Col span={4}>????????????</Col>
                            <Col span={20}>
                                <Input.Password value={this.state.regForm.rePassword} onChange={(val) => {
                                    this.setState({regForm: ObjectUtil.getNewProperty(this.state, "regForm.rePassword", val.target.value)})
                                }}></Input.Password>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        }
    }

    private ui_body = {
        // ??????func??????????????????????????????????????????token?????????localStorage?????? ???????????????sessionStorage???
        doLogin: () => {
            HttpClient.post(HttpURL.POST_LOGIN, {
                username: this.state.loginForm.username,
                password: this.state.loginForm.password
            }, resp => {
                if (localStorage.getItem("autoLogin") === "true") {
                    localStorage.setItem("auth", resp.data.token)
                } else {
                    sessionStorage.setItem("auth", resp.data.token)
                }
                // connect to websocket
                const wsc = WsClient.Client()
                if (!wsc.available()) {
                    Notification.error("?????????????????????")
                    return
                }
                RouterUtil.push(RouterURL.HOME)
            }, err => {
                // if (err)
                //     Notification.error("????????????: ")
            })
        },
        render: () => {
            return <div>
                <Row>
                    <Col span={4}>??????</Col>
                    <Col span={20}>
                        <Input value={this.state.loginForm.username} onChange={(val) => {
                            this.setState({loginForm: ObjectUtil.getNewProperty(this.state, "loginForm.username", val.target.value)})
                        }}/>
                    </Col>
                </Row>
                <BlankRow/>
                <Row>
                    <Col span={4}>??????</Col>
                    <Col span={20}>
                        <Input.Password value={this.state.loginForm.password} onChange={(val) => {
                            this.setState({loginForm: ObjectUtil.getNewProperty(this.state, "loginForm.password", val.target.value)})
                        }}/>
                    </Col>
                </Row>
                <BlankRow/>
                <Row>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <Checkbox onChange={(e) => {
                            const checked = e.target.checked
                            localStorage.setItem("remember", String(checked))
                        }}>????????????</Checkbox>
                    </Col>
                    <Col span={10}>
                        <Checkbox onChange={(e) => {
                            const checked = e.target.checked
                            localStorage.setItem("autoLogin", String(checked))
                        }}>????????????</Checkbox>
                    </Col>
                </Row>
                <BlankRow/>
                <Row>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <Button onClick={this.ui_register.doOpen}>??????</Button>
                    </Col>
                    <Col span={10} style={{textAlign: "right"}}>
                        <Button type={"primary"} onClick={this.ui_body.doLogin}>??????</Button>
                    </Col>
                </Row>
            </div>
        }
    }

    render() {
        return <div className={css.loginBody}>
            {this.ui_body.render()}
            {this.ui_register.render()}
        </div>;
    }
}