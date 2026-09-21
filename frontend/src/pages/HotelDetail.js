import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/hotels/${id}`)
      .then(res => setHotel(res.data));
  }, [id]);

  if (!hotel) return (
    <div>
      <div className="navbar"><h1>🏨 LuxeStay</h1></div>
      <div className="loading">Loading luxury stay...</div>
    </div>
  );

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh', paddingBottom: '50px' }}>
      <Helmet>
        <title>{hotel.title} - LuxeStay</title>
        <meta name="description" content={hotel.description} />
      </Helmet>

    
      <div className="navbar">
        <h1>🏨 LuxeStay</h1>
      </div>

      <div className="detail-container">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Hotels
        </button>

        <img
          src={hotel.image_path 
  ? `http://localhost:5000/uploads/${hotel.image_path}` 
  : 'https://via.placeholder.com/900x420?text=No+Image'}
          alt={hotel.title}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h1>{hotel.title}</h1>
            <div className="detail-price">₹{hotel.price} <span style={{ fontSize: '16px', color: '#888', fontFamily: 'Poppins' }}>/ night</span></div>
          </div>
          <button
            onClick={() => navigate(`/edit/${hotel.id}`)}
            className="btn-submit"
            style={{ width: 'auto', padding: '12px 30px' }}
          >
            ✏️ Edit Hotel
          </button>
        </div>

        <p style={{ color: '#555', lineHeight: '1.9', fontSize: '15px', marginBottom: '25px' }}>
          {hotel.description}
        </p>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ background: 'white', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e0e0e0', borderLeft: '4px solid #c9a84c' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>LATITUDE</p>
            <p style={{ fontWeight: '600', color: '#0f1923' }}>📍 {hotel.latitude}</p>
          </div>
          <div style={{ background: 'white', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e0e0e0', borderLeft: '4px solid #c9a84c' }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>LONGITUDE</p>
            <p style={{ fontWeight: '600', color: '#0f1923' }}>📍 {hotel.longitude}</p>
          </div>
        </div>

        
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0f1923', marginBottom: '20px' }}>
          📍 Hotel Location
        </h3>
        <div style={{ height: '420px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '3px solid #c9a84c' }}>
          <MapContainer
            center={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]}>
              <Popup>
                <strong>{hotel.title}</strong><br />
                ₹{hotel.price}/night
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default HotelDetail;