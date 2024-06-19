import { useState } from 'react';
import { useMap } from 'react-leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchControl = () => {
  const [query, setQuery] = useState("")
  const map = useMap();

  const handleSearch =  (e) => {
    e.preventDefault();    
    
    console.log(e)
    }

  return (
    <div style={{ position: 'absolute', top: '1rem', left: '4rem', zIndex: 400, borderRadius: '1rem', width: "20rem" }}>
        <form className="d-flex" role="search">
            <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Buscar..." 
            className="form-control form-control-input-search"
            />
            <button type='button' className="btn btn-primary" onClick={handleSearch}>🔍</button>
        </form>

    </div>
  );
};

export default SearchControl;
