import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import {
    LoginButtonGitHub,
    loginWithPopUp,
    githubAuthProvider,
} from '@the7ofdiamonds/gateway';

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

    const { isAdmin, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );
console.log(isAuthenticated, isAdmin)
console.log(accessToken, refreshToken)
    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, isAdmin]);

    const handleGitHubSignIn = () => {
        dispatch(loginWithPopUp(githubAuthProvider))
    }

    console.log(username)
    return (
        <section className={styles.login}>
            <div className={styles.providers}>
                <LoginButtonGitHub action={handleGitHubSignIn} />
            </div>
        </section>
    )
}

export default LoginPage