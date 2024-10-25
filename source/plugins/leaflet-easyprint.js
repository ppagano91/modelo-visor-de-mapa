import filesaver from 'file-saver';
import { getEnv } from '../config';
import domtoimage from './dom-to-image-more';
import LOGO from "../assets/images/logo-idecaba.png";


L.Control.EasyPrint = L.Control.extend({
  options: {
    title: 'Imprimir mapa',
    position: 'topleft',
    filename: 'map',
    exportOnly: false,
    hidden: false,
    tileWait: 1000,
    hideControlContainer: true,
    hideClasses: [],
    customWindowTitle: window.document.title,
    spinnerBgCOlor: '#0DC5C1',
    customSpinnerClass: 'epLoader',
    printHeader: 'Mapa Impreso',
    additionalContent: '',
    onError: null,
  },

  onAdd: function () { 
    this.mapContainer = this._map.getContainer();
    
    var container = L.DomUtil.create('div', 'leaflet-control-easyPrint leaflet-bar leaflet-control');
    if (!this.options.hidden) {
      this._addCss();

      // this._addListeners(container);

      var btnClass = 'leaflet-control-easyPrint-button';
      if (this.options.exportOnly) btnClass = btnClass + '-export';

      this.link = L.DomUtil.create('a', btnClass, container);
      this.link.id = "leafletEasyPrint";
      this.link.title = this.options.title;
      L.DomEvent.addListener(this.link, 'click', this.printMap, this);

      L.DomEvent.disableClickPropagation(container);
    }
    return container;
  },

  _addListeners: function(container) {
    // Si en el futuro necesitas añadir más listeners, puedes hacerlo aquí
  },

  printMap: function (event, filename) {
    event.preventDefault();

    if (filename) {
      this.options.filename = filename;
    }

    if (!this.options.exportOnly) {
      this._page = window.open("", "_blank", 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10, top=10, visible=none');
      this._page.document.write(this._createSpinner(this.options.customWindowTitle, this.options.customSpinnerClass, this.options.spinnerBgCOlor));
      this._page.addEventListener('beforeunload', () => {
        this._toggleControls(true);
      });
    }

    this.originalState = {
      mapWidth: this.mapContainer.style.width,
      widthWasAuto: false,
      widthWasPercentage: false,
      mapHeight: this.mapContainer.style.height,
      zoom: this._map.getZoom(),
      center: this._map.getCenter()
    };

    if (this.originalState.mapWidth === 'auto') {
      this.originalState.mapWidth = this._map.getSize().x  + 'px';
      this.originalState.widthWasAuto = true;
    } else if (this.originalState.mapWidth.includes('%')) {
      this.originalState.percentageWidth = this.originalState.mapWidth;
      this.originalState.widthWasPercentage = true;
      this.originalState.mapWidth = this._map.getSize().x  + 'px';
    }

    // this._map.fire("easyPrint-start", { event: event });

    if (!this.options.hidden) {
      // Si tienes controles adicionales que ocultar, maneja aquí
      this._toggleControls(false);    
    }

    if (this.options.hideClasses.length > 0) {
      this._toggleClasses(this.options.hideClasses);
    }

    this.outerContainer = this._createOuterContainer(this.mapContainer);
    if (this.originalState.widthWasAuto) {
      this.outerContainer.style.width = this.originalState.mapWidth;
    }

    this._createImagePlaceholder();
  },

  _createImagePlaceholder: function () {
    var plugin = this;
    
    domtoimage.toPng(this.mapContainer, {
        width: parseInt(this.originalState.mapWidth.replace('px')),
        height: parseInt(this.originalState.mapHeight.replace('px'))
      })
      .then(function (dataUrl) {
        plugin.blankDiv = document.createElement("div");
        var blankDiv = plugin.blankDiv;
        plugin.outerContainer.parentElement.insertBefore(blankDiv, plugin.outerContainer);
        blankDiv.className = 'epHolder';
        blankDiv.style.backgroundImage = 'url("' + dataUrl + '")';
        blankDiv.style.position = 'absolute';
        blankDiv.style.zIndex = 1011;
        blankDiv.style.display = 'initial';
        blankDiv.style.width = plugin.originalState.mapWidth;
        blankDiv.style.height = plugin.originalState.mapHeight;
        plugin._resizeAndPrintMap();
      })
      .catch(function (error) {
        if (plugin.options.onError) {
            plugin.options.onError(error);
        }
        plugin._page.close();
        plugin._toggleControls(true);
    });
  },

  _resizeAndPrintMap: function () {
    this.outerContainer.style.opacity = 0;
    this.mapContainer.style.width = this.originalState.mapWidth;
    this.mapContainer.style.height = this.originalState.mapHeight;
    this.orientation = (this.mapContainer.style.width > this.mapContainer.style.height) ? 'landscape' : 'portrait';
    this._map.setView(this.originalState.center);
    this._map.setZoom(this.originalState.zoom);
    this._map.invalidateSize();

    if (this.options.tileLayer) {
      this._pausePrint();
    } else {
      this._printOperation();
    }
  },

  _pausePrint: function () {
    var plugin = this;
    var loadingTest = setInterval(function () { 
      if(!plugin.options.tileLayer.isLoading()) {
        clearInterval(loadingTest);
        plugin._printOperation();
      }
    }, plugin.options.tileWait);
  },

  _printOperation: function () {
    var plugin = this;
    domtoimage.toPng(plugin.mapContainer, {
        style:{
            "margin":"0 auto",
        }
      })
      .then(function (dataUrl) {
          var blob = plugin._dataURItoBlob(dataUrl);
          if (plugin.options.exportOnly) {
            filesaver.saveAs(blob, plugin.options.filename + '.png');
          } else {
            plugin._sendToBrowserPrint(dataUrl, plugin.orientation);
          }
          plugin._toggleControls(true);
          plugin._toggleClasses(plugin.options.hideClasses, true);

          if (plugin.outerContainer) {
            if (plugin.originalState.widthWasAuto) {
              plugin.mapContainer.style.width = 'auto';
            } else if (plugin.originalState.widthWasPercentage) {
              plugin.mapContainer.style.width = plugin.originalState.percentageWidth;
            }
            else {
              plugin.mapContainer.style.width = plugin.originalState.mapWidth;              
            }
            plugin.mapContainer.style.height = plugin.originalState.mapHeight;
            plugin._removeOuterContainer(plugin.mapContainer, plugin.outerContainer, plugin.blankDiv);
            plugin._map.invalidateSize();
            plugin._map.setView(plugin.originalState.center);
            plugin._map.setZoom(plugin.originalState.zoom);
          }
          // plugin._map.fire("easyPrint-finished");
      })
      .catch(function (error) {
          console.error('La operación de impresión falló', error);
      }); 
  },

  _sendToBrowserPrint: function (img, orientation) {
    var pageContent = this._createNewWindow(img, orientation, this);
    this._page.document.body.innerHTML = '';
    this._page.document.write(pageContent);
    this._page.document.close();  
  },

  _createSpinner: function (title, spinnerClass, spinnerColor) {
    return `
    <html>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
      .loader {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid black;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
      }

      /* Safari */
      @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      </style>
      </head>
      <body>

      <div style="display: flex; align-items:center; justify-content: center; margin:100px">
        <div class="loader"></div>
      </div>

      </body>
    </html>`;
  },

  _createNewWindow: function (img, orientation, plugin) {
    return `
      <html>
        <head>
            <title>${plugin.options.customWindowTitle}</title>
            <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    background-color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .print-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: black;
                    background-color: ${getEnv("VITE_COLOR_BLANCO")};
                    border-bottom: .25rem solid ${getEnv("VITE_COLOR_PRIMARY")};
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    width: 100%; /* Que el header ocupe todo el ancho */
                }

                .print-header img {
                    height: 30px;
                    width: auto;
                    margin-left: 10px;
                }

                .header-text {              
                  font-family: 'Nunito', sans-serif;
                  font-size: 24px;
                  font-weight: 600;
                  color: #625a71;
                  text-align: center;
                  flex-grow: 1;
                  padding: 10px;
                }

                .additional-content {
                    text-align: center;
                    font-size: 16px;
                }

                .print-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                    max-width: 100%; /* Limitar el ancho al máximo disponible */
                }

                .content {
                    flex: 1;
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .map-container {
                    position: relative;
                    width: 100%;
                    height: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                    max-width: 100%; /* Asegura que ocupe todo el ancho */
                }
                
                .map-container img {
                    width: 100%; /* Ocupa todo el ancho disponible */
                    height: auto; /* Mantiene la proporción de la imagen */
                }

                .date-container {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 12px;
                    color: black;
                    background-color: rgba(255, 255, 255, 0.2);
                    padding: 5px;
                    border-radius: 3px;
                    opacity: 0.8;
                }
            </style>
            <script>
            function step1() {
                const dateElement = document.getElementById('current-date');
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                dateElement.textContent = "Fecha: " + formattedDate;
                setTimeout(step2, 10);
            }

            function step2() {
                window.print();
                window.close();
            }
            </script>
        </head>
        <body onload="step1()">
            ${plugin.options.additionalContent ? `<div class="additional-content">${plugin.options.additionalContent}</div>` : ''}
              <div class="print-container">
                <div class="print-header">
                    <img src=${LOGO} alt="Logo" />
                    <h2 class="header-text">${plugin.options.printHeader}</h2>
                </div>            
                <div class="map-container">            
                    <img src="${img}" alt="Mapa">
                    <div class="date-container">
                        <span id="current-date"></span>
                    </div>
                </div>
                <div class="content">
                </div>
            </div>
        </body>
    </html>
    `;
},




  _createOuterContainer: function (mapDiv) {
    var outerContainer = document.createElement('div'); 
    mapDiv.parentNode.insertBefore(outerContainer, mapDiv); 
    // mapDiv.parentNode.removeChild(mapDiv);
    // outerContainer.appendChild(mapDiv);
    outerContainer.style.width = mapDiv.style.width;
    outerContainer.style.height = mapDiv.style.height;
    outerContainer.style.display = 'inline-block';
    outerContainer.style.overflow = 'hidden';
    return outerContainer;
  },

  _removeOuterContainer: function (mapDiv, outerContainer, blankDiv) {
    if (outerContainer.parentNode) {
      outerContainer.parentNode.insertBefore(mapDiv, outerContainer);
      outerContainer.parentNode.removeChild(blankDiv);
      outerContainer.parentNode.removeChild(outerContainer);      
    }
  },

  _addCss: function () {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `.leaflet-control-easyPrint-button { 
      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMTI4LDMyaDI1NnY2NEgxMjhWMzJ6IE00ODAsMTI4SDMyYy0xNy42LDAtMzIsMTQuNC0zMiwzMnYxNjBjMCwxNy42LDE0LjM5OCwzMiwzMiwzMmg5NnYxMjhoMjU2VjM1Mmg5NiAgIGMxNy42LDAsMzItMTQuNCwzMi0zMlYxNjBDNTEyLDE0Mi40LDQ5Ny42LDEyOCw0ODAsMTI4eiBNMzUyLDQ0OEgxNjBWMjg4aDE5MlY0NDh6IE00ODcuMTk5LDE3NmMwLDEyLjgxMy0xMC4zODcsMjMuMi0yMy4xOTcsMjMuMiAgIGMtMTIuODEyLDAtMjMuMjAxLTEwLjM4Ny0yMy4yMDEtMjMuMnMxMC4zODktMjMuMiwyMy4xOTktMjMuMkM0NzYuODE0LDE1Mi44LDQ4Ny4xOTksMTYzLjE4Nyw0ODcuMTk5LDE3NnoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
      background-size: 16px 16px; 
      cursor: pointer; 
      width: 30px;
      height: 30px;
      display: block;
      background-repeat: no-repeat;
      background-position: center;
    }
    .leaflet-control-easyPrint-button-export { 
      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
      background-size: 16px 16px; 
      cursor: pointer; 
    }
    .epHolder {
      /* Estilos para el holder de la imagen */
    }
    .leaflet-control-easyPrint-button{
      display: inline-block;
    }

    /* Estilos adicionales si es necesario */
    `;
    document.body.appendChild(css);
  },

  _dataURItoBlob: function (dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], {type: mimeString});
  },

  _toggleControls: function (show) {
    let controlContainer = document.getElementsByClassName("leaflet-control-container")[0];
    let serachControl = document.getElementsByClassName("search-control")[0];
    let controls = controlContainer.children;
    if (show) {
        for (var i = 0; i < controls.length; i++) { 
            let controlsIChildren = controls[i].children;           
            for (var j = 0; j < controlsIChildren.length; j++) {
                controlsIChildren[j].style.display = 'block';
            }
        }
        if(serachControl) serachControl.style.display = "block";
    }
    else{
        for (var i = 0; i < controls.length; i++) { 
            let controlsIChildren = controls[i].children;
            for (var j = 0; j < controlsIChildren.length; j++) {            
                if (controlsIChildren[j].classList.contains("leaflet-control-scale")) {
                    controlsIChildren[j].style.display = 'block';
                } else{
                    controlsIChildren[j].style.display = 'none';
                }
            }
        }
        if(serachControl) serachControl.style.display = "none";
    }
  },

  _toggleClasses: function (classes, show) {
    classes.forEach(function (className) {
      var div = document.getElementsByClassName(className)[0];
      if (div) {
        div.style.display = show ? 'block' : 'none';
      }
    });
  },
  
});

L.easyPrint = function(options) {
  return new L.Control.EasyPrint(options);
};
