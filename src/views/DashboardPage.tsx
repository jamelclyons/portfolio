import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Section, Button, StatusBar, Main } from '@the7ofdiamonds/ui-ux';
import type { StatusBarVisibility, MessageType } from '@the7ofdiamonds/ui-ux';

import { logout, checkHeaders } from '@the7ofdiamonds/gateway';

import styles from './DashboardPage.module.scss';

interface DashboardPageProps {
    useAppDispatch: () => AppDispatch;
    useAppSelector: TypedUseSelectorHook<RootState>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ useAppDispatch, useAppSelector }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>('info');
    const [showStatusBar, setShowStatusBar] = useState<StatusBarVisibility>('hide');

    useEffect(() => {
        if (!checkHeaders()) {
            navigate('/login');
        }
    }, []);

    const handleSkillAdd = () => {
        navigate('/admin/add/skill');
    };

    const handleUpdateProject = () => {
        navigate('/admin/update/portfolio');
    };

    const handleLogout = async () => {
        try {
            dispatch(logout());

            window.location.href = '/';
        } catch (error) {
            const err = error as Error;

            setMessage(`Logout error: ${err.message}`);
            setMessageType('error');
            setShowStatusBar('show');
        }
    };

    return (
        <Section>
            <Main>
                <h2 className='title'>Dashboard</h2>

                <div className={styles.options}>
                    <Button title={'add skill'} action={handleSkillAdd} />

                    <Button title={'update projects'} action={handleUpdateProject} />
                </div>

                <Button title={'logout'} action={handleLogout} />
            </Main>

            {showStatusBar && message && <StatusBar show={showStatusBar} messageType={messageType} message={message} />}
        </Section>
    )
}

export default DashboardPage;