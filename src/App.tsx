import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, HashRouter, Link, Route, Routes} from "react-router-dom";
import {PasswdInfo as MPasswdInfo} from "./mobile/PasswdInfo";
import {Login as MLogin} from "./mobile/Login"
import {Register as MRegister} from "./mobile/Register"
import RouterUtil from "./common/utils/RouterUtil";
import {Login} from "./pc/Login";
import StorageUtil from "./common/utils/StorageUtil";
import Home from "./pc/Home";

class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        if (RouterUtil.getPath() === "/") {
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                //手机
                RouterUtil.push("/m/login")
            } else {
                //电脑
                if (StorageUtil.get("autoLogin") === "true") {
                    RouterUtil.push("/home")
                } else
                    RouterUtil.push("/login")
            }
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    {/*  <Route component={} path={"/login"}/>*/}
                    <Route path={"/login"} element={<Login/>}></Route>
                    <Route path={"/home"} element={<Home/>}></Route>
                    <Route path={"/m/login"} element={<MLogin/>}></Route>
                    <Route path={"/m/register"} element={<MRegister/>}></Route>
                    <Route path={"/m/passwdInfo"} element={<MPasswdInfo/>}></Route>
                </Routes>
            </BrowserRouter>
        );
    }

}

export default App;
