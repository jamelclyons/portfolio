import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Section, Main } from '@the7ofdiamonds/ui-ux';
import {
    LoginComponent,
    LoginButtonApple,
    LoginButtonGoogle,
    LoginButtonMicrosoft,
    LoginButtonGitHub,
    loginWithPopUp,
    appleAuthProvider,
    githubAuthProvider,
    googleAuthProvider,
    microsoftAuthProvider
} from '@the7ofdiamonds/gateway';

// import { useAppSelector, useAppDispatch } from '@/model/hooks';

import styles from './Login.module.scss';

interface LoginPageProps {
    useAppDispatch: () => AppDispatch;
    useAppSelector: TypedUseSelectorHook<RootState>;
}

const LoginPage: React.FC<LoginPageProps> = ({ useAppDispatch, useAppSelector }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        loginLoading,
        loginStatusCode,
        loginSuccessMessage,
        loginErrorMessage,
        accessToken,
        refreshToken,
        username,
    } = useAppSelector((state) => state.login);

    const [showGoogleButton, setShowGoogleButton] = useState<boolean>(true);
    const [showAppleButton, setShowAppleButton] = useState<boolean>(true);
    const [showMicrosoftButton, setShowMicrosoftButton] = useState<boolean>(true);
    const [showGitHubButton, setShowGitHubButton] = useState<boolean>(true);

    // const { isAdmin, isAuthenticated } = useAppSelector(
    //     (state) => state.auth
    // );

    // useEffect(() => {
    //     if (isAuthenticated && isAdmin) {
    //         navigate('/admin/dashboard');
    //     }
    // }, [isAuthenticated, isAdmin]);

    // useEffect(() => {
    //     if (showEmailPassword === false) {
    //         setShowEmailPasswordForm(false);
    //     }
    //     if (showGoogle === false) {
    //         setShowGoogleButton(false);
    //     }
    //     if (showApple === false) {
    //         setShowAppleButton(false);
    //     }
    //     if (showMicrosoft === false) {
    //         setShowMicrosoftButton(false);
    //     }
    //     if (showGitHub === false) {
    //         setShowGitHubButton(false);
    //     }
    // }, [showEmailPassword, showGoogle, showApple, showMicrosoft, showGitHub]);

    const handleAppleSignIn = async () => {
        dispatch(loginWithPopUp(appleAuthProvider))
    };

    const handleGoogleSignIn = async () => {
        dispatch(loginWithPopUp(googleAuthProvider))
    };

    const handleMicrosoftIn = async () => {
        dispatch(loginWithPopUp(microsoftAuthProvider))
    };

    const handleGitHubSignIn = () => {
        dispatch(loginWithPopUp(githubAuthProvider))
    }

    console.log(username)
    return (
        <Section>
            <Main>
                <LoginComponent>
                    <div className={styles.providers}>
                        {showAppleButton && <LoginButtonApple action={handleAppleSignIn} />}

                        {showGoogleButton && <LoginButtonGoogle action={handleGoogleSignIn} />}

                        {showMicrosoftButton && <LoginButtonMicrosoft action={handleMicrosoftIn} />}

                        {showGitHubButton && <LoginButtonGitHub action={handleGitHubSignIn} />}
                    </div>
                </LoginComponent>
            </Main>
        </Section>
    )
}

export default LoginPage