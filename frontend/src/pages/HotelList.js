import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHotels, deleteHotel } from '../store/hotelSlice';
import { Helmet } from 'react-helmet';
import '../App.css';

function HotelList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.hotels);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchHotels({ title: search, minPrice, maxPrice, page, limit: 6 }));
  }, [dispatch, search, minPrice, maxPrice, page]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('added') === 'true') {
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    }
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteHotel(id));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div>
      <Helmet>
        <title>Hotel List - Luxury Stays</title>
        <meta name="description" content="Browse our luxury hotel listings" />
      </Helmet>

      <div className="navbar">
        <h1>🏨 Luxe<span>Stay</span></h1>
        <button onClick={() => navigate('/add')}>+ Add Hotel</button>
      </div>

      <div className="search-section">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: '130px' }}
        />
        <input
          placeholder="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: '130px' }}
        />
      </div>

      {showPopup && (
        <div className="success-popup">
          <span className="popup-icon">🗑️</span>
          <div className="popup-text">
            <h4>Deleted Successfully!</h4>
            <p>Hotel has been removed</p>
          </div>
        </div>
      )}

      {addSuccess && (
        <div className="success-popup">
          <span className="popup-icon">🏨</span>
          <div className="popup-text">
            <h4>Hotel Added!</h4>
            <p>New luxury stay is live</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading luxury stays...</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <h3>No Hotels Found</h3>
          <p>Add your first luxury hotel!</p>
        </div>
      ) : (
        <div className="hotel-grid">
          {list.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              {hotel.image_path && (
                <img
                  src={`http://127.0.0.1:5000/uploads/${hotel.image_path}`}
                  alt={hotel.title}
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="hotel-card-body">
                <h3>{hotel.title}</h3>
                <p>{hotel.description?.substring(0, 80)}...</p>
                <div className="hotel-price">
                  ₹{Number(hotel.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  <span style={{ fontSize: '13px', color: '#888', fontWeight: '400', marginLeft: '5px' }}>/night</span>
                </div>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => navigate(`/edit/${hotel.id}`)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(hotel.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          ← Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default HotelList;