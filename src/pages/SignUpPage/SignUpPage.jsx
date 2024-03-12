import React, { useEffect, useState } from "react";
import './SignUpPage.scss'
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogo from '../../assests/images/Login/SignIn.png'
import { Image } from "antd";
import {
    EyeOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons'
import { useNavigate } from "react-router";
import { useMutationHooks } from "../../hooks/userMutationHook";
import * as userServices from '../../services/userServices'
import * as message from '../../components/Message/Message'
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
import _ from "lodash";
const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const defaultValid = {
        email: true,
        password: true,
        confirmPassword: true
    }
    const [isValidInputs, setIsValidInputs] = useState(defaultValid);
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate()
    const handleNavigationSignIn = () => {
        navigate('/sign-in')
    }
    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
        if(email !== '') {
            const _isValidInputs = _.cloneDeep(isValidInputs);
            _isValidInputs['email'] = true;
            setIsValidInputs(_isValidInputs);
        }
    }
    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
        if(password !== '') {
            const _isValidInputs = _.cloneDeep(isValidInputs);
            _isValidInputs['password'] = true;
            setIsValidInputs(_isValidInputs);
        }
    }
    const handleOnchangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if(confirmPassword !== '') {
            const _isValidInputs = _.cloneDeep(isValidInputs);
            _isValidInputs['confirmPassword'] = true;
            setIsValidInputs(_isValidInputs);
        }
    }
    
    const mutationSignUp = useMutationHooks(
        data => userServices.signupUser(data)
    )
    const {data: dataSignUp, isLoading: isLoadingSignUp, isSuccess: isSuccessSignUp} = mutationSignUp;
    useEffect(() => {
        if(dataSignUp && dataSignUp.status === 'OK'){
            message.success("Người dùng đã được tạo thành công...");
            navigate('/sign-in');
        } else if(dataSignUp && dataSignUp.status === 'ERR') {
            console.log(dataSignUp.message);
            if(dataSignUp.err_fields) {
                setErrMsg(dataSignUp.message);
                const _isValidInputs = _.cloneDeep(isValidInputs);
                _isValidInputs['email'] = false;
                setIsValidInputs(_isValidInputs);
            } 
        }
        // console.log('dataSignUp: ', dataSignUp);
    }, [dataSignUp])

    const validInputs = () => {
        const arrErr = [];
        if(!email) {
            arrErr.push('email');
        }
        if(!password) {
            arrErr.push('password');
        }
        if(!confirmPassword) {
            arrErr.push('confirmPassword', 'password');
        }
        if(password !== confirmPassword) {
            arrErr.push('confirmPassword', 'password', 'isSame');
        }
        if(arrErr.length > 0) {
            const _isValidInputs = _.cloneDeep(isValidInputs);
            arrErr.forEach(err => {
                _isValidInputs[err] = false;
            });
            let checkErrSamePassword = arrErr.some(item => item === 'isSame');
            if(!checkErrSamePassword) {
                setErrMsg("Không được để trống thông tin...");
            } else {
                setErrMsg("Mật khẩu không trùng khớp...");
            } 
            setIsValidInputs(_isValidInputs);
            return false;
        }
        setErrMsg('')
        return true;
    }

    const handleSignUp = async () => {
        const isValid = validInputs();
        if(isValid) {
            mutationSignUp.mutate({ email, password, confirmPassword})
        }
    }
    return(
        <div className="background">
            <div className="sign-up-container">
                <div className="container-left">
                    <h1>Xin chào,</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputFormComponent 
                        className={isValidInputs.email ? "input form-control" : "input form-control is-invalid"}
                        placeholder="Nhập địa chỉ email"
                        type="email"
                        valueinput={email}
                        onChange={(e) => handleOnchangeEmail(e)}
                    />
                    <div className="input-password">
                        <InputFormComponent 
                            className={isValidInputs.password ? "input form-control" : "input form-control is-invalid"}
                            placeholder="Nhập mật khẩu"
                            type="password"
                            valueinput={password}
                            onChange={(e) => handleOnchangePassword(e)}
                        />
                    </div>
                    <div className="input-confirm-password">
                        <InputFormComponent 
                            className={isValidInputs.confirmPassword ? "input form-control" : "input form-control is-invalid"}
                            placeholder= 'Nhập lại mật khẩu'
                            type='password'
                            valueinput={confirmPassword}
                            onChange={(e) => handleOnchangeConfirmPassword(e)}
                        />
                        {errMsg !== '' && <span className="err-msg">{errMsg}</span>}
                    </div>
                    <LoadingComponent isLoading={isLoadingSignUp}>
                    <ButtonComponent 
                        onClick={() => handleSignUp()}
                        bordered="false"
                        size={40}
                        styleButton={{
                            backgroundColor: 'rgb(255, 57, 69)',
                            height: '35px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '5px',
                            margin: '26px 0 10px'
                        }}
                        textButton={'Tạo tài khoản'}
                        styleTextButton={{
                            color: '#fff', fontSize: '15px', fontWeight: '700'
                        }}
                    />
                    </LoadingComponent>
                    <p>Bạn đã có tài khoản? <span className="text-create-account" onClick={() => handleNavigationSignIn()}>Đăng nhập</span></p>
                </div>
                <div className="container-right">
                    <Image src={ImageLogo} alt="Image Logo" preview={false}
                        className="image-logo"
                    />
                    <div className="content">
                        <h4>Mua sắm tại Mobile Shop</h4>
                        <span>Siêu ưu đãi mỗi ngày</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage