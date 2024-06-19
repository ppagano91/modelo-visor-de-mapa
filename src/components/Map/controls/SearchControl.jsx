import { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Autocompleter} from "autocompleter-caba";

const autocompleter = new Autocompleter();

autocompleter.setCredentials("97855b0c", "e926c45155e52bddcfc598210c28bf41");

const SearchControl = () => {
  const [suggestions, setSuggestions] = useState([])
  const [input, setInput] = useState("")
  const [debouncedInput, setDebouncedInput] = useState('');
  const [selectedIndex , setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  
  useEffect(() => {
    const getData = async () => {
      if (debouncedInput !== '') {
        const data = await autocompleter.getSuggestions(debouncedInput);
        const filteredSuggestions = data.filter(suggestion => !suggestion.error);
        setSuggestions(filteredSuggestions);
      }
      else{
        setSuggestions([])
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch =  async (index) => {
    const data = await autocompleter.getSearch(suggestions[index]);
    console.log(data)
    
  }

  const handleInputClick = () => {
    if (input !== '' && suggestions.length === 0) {
      setDebouncedInput(input); // Trigger the fetch if suggestions are empty
    }
  };

  const setSelectedSuggestionIndex = (i) =>{
    setSelectedIndex(i);
  }

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]);
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

  return (
    <div ref={searchRef} style={{ position: 'absolute', top: '1rem', left: '4rem', zIndex: 400, borderRadius: '1rem', width: "20rem" }}>
        <form className="d-flex" role="search">
            <input 
            type="text" 
            value={input}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Buscar..." 
            className="form-control form-control-input-search"
            />
            <button type='button' className="btn btn-primary" onClick={()=>handleSearch(selectedIndex)}>🔍</button>
        </form>
        <ul className={`bg-light m-0 p-0`} style={{paddingLeft: "1rem"}}>
          {suggestions && suggestions.map((sug, i) => {            
            return <li
              key={i}
              className={`p-1 ${selectedIndex==i ? "bg-warning":""}`}
              style={{listStyle: "none", cursor: "pointer"}}
              onClick={() => handleSearch(i)}
              onMouseOver={() => setSelectedSuggestionIndex(i)}
              >{sug.value}</li>
          })}
        </ul>
    </div>
  );
};

export default SearchControl;
