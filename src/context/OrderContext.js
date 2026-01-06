import React, { createContext, useContext, useState } from 'react';
import apiClient from '../api/apiClient';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [activeOrder, setActiveOrder] = useState(null);

    const reload = async () => {
        try {
            const res = await apiClient.get('/drivers/active-order'); // ✅ FIXED
            setActiveOrder(res?.data?.data || null);
        } catch {
            setActiveOrder(null);
        }
    };

    return (
        <OrderContext.Provider value={{ activeOrder, reload }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
