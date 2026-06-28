import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';


import { setIsAdmin, setIsAuthenticated } from '@the7ofdiamonds/gateway';

import { useAppDispatch, useAppSelector } from './model/hooks';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    
    const {
        isAdmin
    } = useAppSelector((state) => state.auth);

    useEffect(()=>{
        dispatch(setIsAdmin())
    },[]);

    return isAdmin ? (
        children
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedRoute;