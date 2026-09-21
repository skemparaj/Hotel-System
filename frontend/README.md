
Run backend:

```bash
node index.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/hotels | Get all hotels with search, filter, pagination |
| GET | /api/hotels/:id | Get single hotel by ID |
| POST | /api/hotels | Create new hotel with image |
| PUT | /api/hotels/:id | Update hotel by ID |
| DELETE | /api/hotels/:id | Delete hotel by ID |

## Running the Application

1. Start PostgreSQL
2. Run Backend: `node index.js` → Port 5000
3. Run Frontend: `npm start` → Port 3000
4. Open: `http://localhost:3000`n