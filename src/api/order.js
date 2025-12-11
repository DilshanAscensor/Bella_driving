import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/api';

export const fetchNewOrders = async () => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        const response = await axios.get(`${BASE_URL}/api/drivers/new-orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        return response.data.data;

    } catch (error) {
        console.log("🔥 API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const acceptOrder = async (order_id) => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        const response = await axios.post(
            `${BASE_URL}/api/drivers/orders/${order_id}/accept`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        );

        return response.data.data;

    } catch (error) {
        console.log("🔥 API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const confirmPickup = async (order_id) => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        const response = await axios.post(
            `${BASE_URL}/api/drivers/orders/${order_id}/pickedup`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        );
        return response.data.order;

    } catch (error) {
        console.log("🔥 API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const onTheWay = async (order_id, formData) => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        const response = await axios.post(
            `${BASE_URL}/api/drivers/orders/${order_id}/on-the-way`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.order;

    } catch (error) {
        console.log("🔥 API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const delivered = async (order_id, formData) => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        const response = await axios.post(
            `${BASE_URL}/api/drivers/orders/${order_id}/delivered`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.order;

    } catch (error) {
        console.log("🔥 API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const confirmDeliveryApi = async (order_id, payment_method) => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        let formData = new FormData();
        formData.append("payment_method", payment_method);

        const response = await axios.post(
            `${BASE_URL}/api/drivers/orders/${order_id}/confirm-delivery`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;

    } catch (error) {
        console.log("🔥 API ERROR:", error.response?.data || error.message);
        throw error;
    }
};

export const getOrders = async (customer_id) => {
    try {
        const token = await AsyncStorage.getItem("auth_token");

        const response = await axios.get(
            `${BASE_URL}/api/customer/orders/${customer_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        return response.data;

    } catch (error) {
        console.log("🔥 API Error:", error.response?.data || error.message);
        throw error;
    }
};