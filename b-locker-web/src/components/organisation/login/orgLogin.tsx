import React, { useState } from 'react';
import './orgLogin.scss';
import { useTranslation } from 'react-i18next';
import lockIcon from '../../../assets/lock.svg'
import lockers from '../../../assets/lockers.png'
import { useHistory } from 'react-router';
import UserHeader from '../../users/header/userHeader';
import { httpProvider } from '../../../global/http/httpProvider';
import { authProvider } from '../../../global/auth/authProvider';
import { useAlert } from 'react-alert';

const OrgLogin: React.FC = () => {
    let history = useHistory();
    let http = new httpProvider();
    const auth = new authProvider();
    const alert = useAlert();
    const [email, setEmail] = useState("");
    const [passcode, setPasscode] = useState("");
    const { t } = useTranslation();
    
    function unlock(e: any) {
        if (passcode) {
            checkPasscode(passcode).then((res)=>{
                if(res){
                    auth.setDevDebugToken(true);
                    history.push('/dashboard');
                }
                else{
                    // Do nothing, this is already handled in the checkPasscode method
                }
            }).catch((err)=>{
                alert.error(t('error.somethingwentwrong.global'))
            }) 
        }
        else {
            alert.error('Fill in a passcode');
        }
    }

    function checkPasscode(passcode: string): Promise<boolean>{
        return new Promise<boolean>((resolve, reject)=>{
            http.postRequestQueryParams('/managers/login?email='+email+'&password='+passcode ).then((res)=>{
                if(res.status === 200){
                    if(res.data.data.token){
                        handleJWT(res.data.data.token);
                        resolve(true);
                    }
                    else{
                        reject(false);
                    }
                }
                else{
                    reject(false);
                }
            }).catch((error)=>{
                if(error.response){
                    let data = error.response.data;
                    if(data.message){
                        alert.error(data.message);
                        if(data.message === "You have no more attempts left."){
                            history.push('/lockdown');
                        }
                    }
                    if(data.error === "Invalid credentials."){
                        alert.error(data.error);
                    }
                    resolve(false);
                }
            });
        })
    }

    function handleJWT(jwt: string){
        auth.setJWT(jwt);
    }

    function redirectForgotPass(e: any) {
        history.push('/forgotPass');
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            unlock(event);
        }
    }

    return (
        <div className="left-div-login">
            <UserHeader></UserHeader>
            <div className="unlock-div-login screen-rule">
                <div className="title-icon-login-div">
                    <p className="global-page-title unlock-title">{t('login.title.label')}</p>
                    <img className="lock-icon-login" src={lockIcon} alt='' />
                </div>
                <p className="global-desc-label">{t('login.desc.label')}</p>
                <input className="pass-input global-input" placeholder={t('login.user.hint')}
                    type="email"
                    id="email"
                    onChange={evt => setEmail(evt.target.value)}>
                </input>
                <input className="pass-input global-input" placeholder={t('login.pass.hint')}
                    type="password"
                    id="passcode"
                    onChange={evt => setPasscode(evt.target.value)}
                    onKeyPress={handleKeyPress} >
                </input>
                <br />
                <button className="global-button global-button-green" onClick={unlock}>{t('login.check.label')}</button>
                <br />
                <button className="href-button" onClick={redirectForgotPass}>{t('login.forgotpass.label')}</button>
            </div>
            <div className="right-div-login">
                <div className="centered">
                    <img className="lockers-login" src={lockers} alt='Lockers' />
                    
                </div>
            </div>
        </div>
        
    );
}

export default OrgLogin;