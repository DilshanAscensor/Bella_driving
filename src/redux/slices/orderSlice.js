import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        newOrder: null,
    },
    reducers: {
        setNewOrder: (state, action) => {
            state.newOrder = action.payload;
        },
        clearOrder: (state) => {
            state.newOrder = null;
        }
    }
});

export const { setNewOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;