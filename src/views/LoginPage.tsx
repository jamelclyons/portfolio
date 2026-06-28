import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { Section, Main } from '@the7ofdiamonds/ui-ux';

import { LoginComponent } from '@the7ofdiamonds/gateway';

import { useAppSelector } from '@/model/hooks';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const { isAdmin, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, isAdmin]);

    return (
        <Section>
            <Main>
                <LoginComponent />
            </Main>
        </Section>
    )
}

export default LoginPage