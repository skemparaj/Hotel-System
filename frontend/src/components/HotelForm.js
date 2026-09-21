import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addHotel, updateHotel } from '../store/hotelSlice';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import '../App.css';

function HotelForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', description: '', latitude: '', longitude: '', price: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:5000/api/hotels/${id}`).then(res => {
        const h = res.data;
        setForm({
          title: h.title, description: h.description,
          latitude: h.latitude, longitude: h.longitude, price: h.price
        });
        setPreview(`http://localhost:5000/uploads/${h.image_path}`);
      });
    }
  }, [id, isEdit]);

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = 'Title is required';
    if (!form.description.trim()) err.description = 'Description is required';
    if (!form.latitude) err.latitude = 'Latitude is required';
    if (!form.longitude) err.longitude = 'Longitude is required';
    if (!form.price || form.price <= 0) err.price = 'Valid price is required';
    if (!isEdit && !image) err.image = 'Image is required';
    return err;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);
    formData.append('price', form.price);
    if (image) formData.append('image', image);
    if (isEdit) {
      dispatch(updateHotel({ id, formData })).then(() => navigate('/'));
    } else {
      dispatch(addHotel(formData)).then(() => navigate('/?added=true'));
    }
  };

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh', paddingBottom: '50px' }}>
      <Helmet>
        <title>{isEdit ? 'Edit Hotel' : 'Add Hotel'} - LuxeStay</title>
      </Helmet>

      
      <div className="navbar">
        <h1>🏨 LuxeStay</h1>
      </div>

      <div className="form-container">
        <h2>{isEdit ? '✏️ Edit Hotel' : '➕ Add New Hotel'}</h2>

        <form onSubmit={handleSubmit}>
        
          <div className="form-group">
            <label>Hotel Image</label>
            <input type="file" accept="image/*" onChange={handleImage}
              style={{ width: '100%', padding: '10px', border: '2px dashed #c9a84c',
                borderRadius: '10px', background: '#fafafa', cursor: 'pointer' }} />
            {errors.image && <p className="error-text">{errors.image}</p>}
            {preview && (
              <img src={preview} alt="preview"
                style={{ width: '100%', height: '220px', objectFit: 'cover',
                  borderRadius: '12px', marginTop: '12px', border: '2px solid #c9a84c' }} />
            )}
          </div>

         
          <div className="form-group">
            <label>Hotel Name</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. The Grand Palace" />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

        
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the hotel..." rows={4}
              style={{ width: '100%', padding: '13px 18px', border: '2px solid #e0e0e0',
                borderRadius: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '14px',
                outline: 'none', resize: 'vertical', background: '#fafafa' }} />
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>

       
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Latitude</label>
              <input name="latitude" value={form.latitude} onChange={handleChange}
                placeholder="e.g. 13.0827" type="number" step="any" />
              {errors.latitude && <p className="error-text">{errors.latitude}</p>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Longitude</label>
              <input name="longitude" value={form.longitude} onChange={handleChange}
                placeholder="e.g. 80.2707" type="number" step="any" />
              {errors.longitude && <p className="error-text">{errors.longitude}</p>}
            </div>
          </div>

         
          <div className="form-group">
            <label>Price per Night (₹)</label>
            <input name="price" value={form.price} onChange={handleChange}
              placeholder="e.g. 15000" type="number" />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button type="button" className="btn-back"
              onClick={() => navigate('/')} style={{ flex: 1, padding: '15px' }}>
              ← Cancel
            </button>
            <button type="submit" className="btn-submit" style={{ flex: 2 }}>
              {isEdit ? '✅ Update Hotel' : '🏨 Add Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HotelForm;