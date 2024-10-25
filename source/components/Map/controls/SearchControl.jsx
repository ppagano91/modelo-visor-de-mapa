import { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "bootstrap/dist/css/bootstrap.min.css";
import { Autocompleter } from "autocompleter-caba/dist/src/services/Autocompleter";
import { getEnv } from "../../../config";

const autocompleter = new Autocompleter();

autocompleter.setCredentials(
  getEnv("VITE_CLIENT_ID"),
  getEnv("VITE_CLIENT_SECRET")
);

const SearchControl = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    const getData = async () => {
      if (debouncedInput !== "") {
        setError(null);
        setSelectedIndex(-1);
        const data = await autocompleter.getSuggestions(debouncedInput);
        const filteredSuggestions = data.filter(
          suggestion => !suggestion.error
        );
        if (filteredSuggestions.length > 0) {
          setSuggestions(filteredSuggestions);
        } else {
          setSuggestions([]);
          const { error, value } = data[1];
          setError({ error, value });
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
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  const handleSearch = async index => {
    let res;
    if (index == -1) {
      res = await autocompleter.getSearch(input);
    } else if (index >= 0 && index < suggestions.length) {
      res = await autocompleter.getSearch(suggestions[index]);
      // setSuggestions([]);
    }

    if (res.status_code == 200) {
      clearMarkers();
      if ("coordenadas" in res.data) {
        // Sitios de Interés
        const { x, y } = res.data.coordenadas;
        if (x && y) {
          const latLng = [y, x];
          clearMarkers();
          const marker = L.marker(latLng).addTo(map);
          setMarkers([marker]);
          map.setView(latLng, 16);
        }
      } else if ("coordenada_x" in res.data && "coordenada_y" in res.data) {
        
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
      if (selectedIndex == -1) {
        setInput(suggestions[0].value);
      } else {
        setInput(suggestions[selectedIndex].value);
      }
      setSuggestions([]);
    } else {
      if ("response" in res) {
        setSuggestions([]);
        const { error, value } = res.response.errors[0];
        setError({ error, value });
      } else if ("error" in res) {
        const { error: value } = res;
        setError({ error: true, value });
        setSuggestions([]);
      }
    }
  };

  const clearMarkers = () => {
    markers.forEach(marker => {
      map.removeLayer(marker);
    });
    setMarkers([]);
  };

  const handleInputClick = () => {
    if (input !== "" && suggestions.length === 0) {
      setDebouncedInput(input);
    }
  };

  const setSelectedSuggestionIndex = i => {
    setSelectedIndex(i);
  };

  const handleClickOutside = event => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]);
      setError(null);
    }
  };

  const handleKeyDown = event => {
    if (event.key === "ArrowDown") {
      setSelectedIndex(prevIndex => (prevIndex + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(prevIndex =>
        prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSearch(selectedIndex);
      setInput(suggestions[selectedIndex].value);
    }
  };

  const handleMouseDown = (event, i) => {
    event.stopPropagation();
    setInput(suggestions[i].value);
    handleSearch(i);
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

  const handleFocus = e => {
    disableMapInteraction();
    // Cambia el estilo del borde cuando el input recibe el foco
    e.target.style.border = "none";
    e.target.style.boxShadow = "0 0 0 0.25rem " + getEnv("VITE_COLOR_THIRD");
  };

  const handleBlur = e => {
    enableMapInteraction();
    // Restaura el borde cuando el input pierde el foco
    // e.target.style.borderColor = "#ced4da";
    e.target.style.boxShadow = "none";
  };

  const handleCleanSearch = () => {
    setInput("");
    setSuggestions([]);
  };

  return (
    <div
      ref={searchRef}
      style={{
        position: "absolute",
        top: "1rem",
        left: "4rem",
        zIndex: 400,
        borderRadius: "1rem",
        width: "22rem",
      }}
      className="search-control"
    >
      <form className="d-flex" role="search">
        <div className="search-container">
          <input
            type="search"
            id="search-btn"
            value={input}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={e => setInput(e.target.value)}
            placeholder="Buscar direcciones..."
            className="form-control input-search input-search-with-button input-tertiary "
            style={{
              fontFamily: "Open Sans",
              width: "22rem",
              height: "2.75rem",
              backgroundColor: getEnv("VITE_COLOR_LIGHT"),
              color: getEnv("VITE_COLOR_SECONDARY")
            }}
          />

          <button
            className="reset"
            type="reset"
            onClick={handleCleanSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button
            className="button-search"
            type="submit"
            onClick={() => handleSearch(selectedIndex)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          ></button>
        </div>
      </form>
      {suggestions && suggestions.length > 0 && (
        <ul
          className={`bg-light my-0 p-0 border rounded-3  ${suggestions.length > 0 ? suggestions.length : error
            }`}
          style={{
            paddingLeft: "1rem",
            fontFamily: "Open Sans",
          }}
        >
          {suggestions.map((sug, i) => {
            return (
              <li
                key={i}
                className={`p-1 ${selectedIndex === i ? "fw-bold text-white" : ""
                  } suggestions-item-list`}
                style={{
                  listStyle: "none",
                  cursor: "pointer",
                  backgroundColor: selectedIndex === i ? "#336ACC" : "inherit",
                }}
                onClick={e => handleMouseDown(e, i)}
                onMouseOver={() => setSelectedSuggestionIndex(i)}
              >
                {sug.value}
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <div
          className="alert alert-danger  my-2 py-3 "
          role="alert"
          style={{
            width: "100%",
            alignItems: "flex-start",
            position: "relative",
            fontFamily: "Open Sans",
          }}
        >
          <span
            style={{
              fontFamily: "Open Sans",
              paddingLeft: "2.5rem",

              justifyContent: "flex-start",
              display: "flex",
              alignItems: "start",
            }}
          >
            {error.value}.
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchControl;