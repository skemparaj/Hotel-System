import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/hotels';

export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (params) => {
  const res = await axios.get(API, { params });
  return res.data;
});

export const addHotel = createAsyncThunk('hotels/add', async (formData) => {
  const res = await axios.post(API, formData);
  return res.data;
});

export const updateHotel = createAsyncThunk('hotels/update', async ({ id, formData }) => {
  const res = await axios.put(`${API}/${id}`, formData);
  return res.data;
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id) => {
  await axios.delete(`${API}/${id}`);
  return id;
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => { state.loading = true; })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(h => h.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.list = state.list.filter(h => h.id !== action.payload);
      });
  },
});

export default hotelSlice.reducer;