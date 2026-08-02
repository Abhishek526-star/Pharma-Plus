import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cart.service';

// Fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const res = await cartService.getCart();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

// Add item to cart
export const addItem = createAsyncThunk('cart/addItem', async ({ medicineId, quantity }, { rejectWithValue }) => {
    try {
        const res = await cartService.addToCart(medicineId, quantity);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
});

// Update item quantity
export const updateItem = createAsyncThunk('cart/updateItem', async ({ medicineId, quantity }, { rejectWithValue }) => {
    try {
        const res = await cartService.updateCart(medicineId, quantity);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
});

// Remove item
export const removeItem = createAsyncThunk('cart/removeItem', async (medicineId, { rejectWithValue }) => {
    try {
        const res = await cartService.removeFromCart(medicineId);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCartState: (state) => {
            state.items = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Add Item
            .addCase(addItem.pending, (state) => { state.isLoading = true; })
            .addCase(addItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items;
            })
            .addCase(addItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Item
            .addCase(updateItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            // Remove Item
            .addCase(removeItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
            });
    },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;