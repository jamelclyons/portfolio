import { useDispatch, useSelector } from 'react-redux';
import type { AppSelectorHook, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: AppSelectorHook = useSelector;