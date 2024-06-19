import { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Autocompleter } from 'autocompleter-caba/dist/src/services/Autocompleter';
import {getEnv} from "../../../config"

const autocompleter = new Autocompleter();

autocompleter.setCredentials(getEnv("VITE_CLIENTE_ID"), getEnv("VITE_CLIENTE_SECRET"));

const SearchControl = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null)
  const searchRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    const getData = async () => {
      if (debouncedInput !== '') {
        setError(null)
        setSelectedIndex(-1);
        const data = await autocompleter.getSuggestions(debouncedInput);
        const filteredSuggestions = data.filter((suggestion) => !suggestion.error);
        if (filteredSuggestions.length>0){
          setSuggestions(filteredSuggestions);
        } else{
          setSuggestions([]);
          const {error, value} = data[1]
          setError({error, value})
        }
      } else {
        setSuggestions([]);
      }
    };
    getData();
  }, [debouncedInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearch = async (index) => {
    let res
    if (index == -1) {
      res = await autocompleter.getSearch(input);      
    }
    else if (index >= 0 && index < suggestions.length) {
      res = await autocompleter.getSearch(suggestions[index]);      
      // setSuggestions([]);
    }
    console.log(res)
    
    if(res.status_code == 200){
      if ("coordenadas" in res.data){
        // Sitios de Interés
        const {x, y} = res.data.coordenadas;
        if (x && y) {
          const latLng = [y, x];
          clearMarkers();
          const marker = L.marker(latLng).addTo(map);
          setMarkers([marker]);
          map.setView(latLng, 16);
        }

      } else if ("coordenada_x" in res.data && "coordenada_y" in res.data){
        // Direcciones
        const { coordenada_x, coordenada_y } = res.data;
        if (coordenada_x && coordenada_y) {
          const latLng = [coordenada_y, coordenada_x];
          clearMarkers();
          const marker = L.marker(latLng).addTo(map);
          setMarkers([marker]);
          map.setView(latLng, 16);
        }
      }      
    }
    else {
      if ("response" in res){
        setSuggestions([])
        const {error, value} = res.response.errors[0]
        setError({error, value})
      }
      else if ("error" in res) {
        const {error: value} = res;
        setError({error: true, value})
        setSuggestions([])
      }
    }
  };

  const clearMarkers = () => {    
    markers.forEach((marker) => {
      map.removeLayer(marker);
    });
    setMarkers([]);
  };

  const handleInputClick = () => {
    if (input !== '' && suggestions.length === 0) {
      setDebouncedInput(input);
    }
  };

  const setSelectedSuggestionIndex = (i) => {
    setSelectedIndex(i);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]);
      setError(null)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) =>
        prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch(selectedIndex);
    }
  };

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  const disableMapInteraction = () => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  };

  const enableMapInteraction = () => {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
  };

  const handleFocus = () => {
    disableMapInteraction();
  };

  const handleBlur = () => {
    enableMapInteraction();
  };

  return (
    <div
      ref={searchRef}
      style={{
        position: 'absolute',
        top: '1rem',
        left: '4rem',
        zIndex: 400,
        borderRadius: '1rem',
        width: '22rem',
      }}
    >
      <form className="d-flex" role="search">
        <input
          type="text"
          value={input}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buscar..."
          className="form-control form-control-input-search"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleSearch(selectedIndex)}
        >
          🔍
        </button>
      </form>
      <ul className={`bg-light m-0 p-0`} style={{ paddingLeft: '1rem' }}>
        {suggestions &&
          suggestions.map((sug, i) => {
            return (
              <li
                key={i}
                className={`p-1 ${selectedIndex === i ? 'bg-warning fw-bold' : ''} suggestions-item-list`}
                style={{ listStyle: 'none', cursor: 'pointer' }}
                onClick={() => handleSearch(i)}
                onMouseOver={() => setSelectedSuggestionIndex(i)}
              >
                {sug.value}
              </li>
            );
          })}
          {error &&
          <div>
            <span className='text-danger p-1 fw-bold msg-error'>{error.value}</span>
          </div>
          }
      </ul>
    </div>
  );
};

export default SearchControl;
