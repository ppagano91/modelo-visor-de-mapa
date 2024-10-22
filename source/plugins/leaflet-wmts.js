L.TileLayer.WMTS = L.TileLayer.extend({
  defaultWmtsParams: {
      service: 'WMTS',
      request: 'GetTile',
      version: '1.0.0',
      layer: '',
      style: '',
      tilematrixset: '', // Asegúrate de definir este valor correctamente
      format: 'image/jpeg'
  },

  initialize: function(url, options) {
      const wmtsParams = L.extend({}, this.defaultWmtsParams);
      const tileSize = options.tileSize || this.options.tileSize;

      if (options.detectRetina && L.Browser.retina) {
          wmtsParams.width = wmtsParams.height = tileSize * 2;
      } else {
          wmtsParams.width = wmtsParams.height = tileSize;
      }

      for (const i in options) {
          if (!this.options.hasOwnProperty(i) && i !== 'matrixIds') {
              wmtsParams[i] = options[i];
          }
      }

      this.wmtsParams = wmtsParams;
      this.matrixIds = options.matrixIds || this.getDefaultMatrix();
      L.TileLayer.prototype.initialize.call(this, url, options);
  },

  onAdd: function(map) {
      this._crs = this.options.crs || map.options.crs;
      // console.log("map\n",map)
      L.TileLayer.prototype.onAdd.call(this, map);
  },

  getTileUrl: function(coords) {
      const tileSize = this.options.tileSize;
      const nwPoint = coords.multiplyBy(tileSize);
      nwPoint.x += 1;
      nwPoint.y -= 1;
      const sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
      const zoom = this._tileZoom;
      const nw = this._crs.project(this._map.unproject(nwPoint, zoom));
      const se = this._crs.project(this._map.unproject(sePoint, zoom));
      const tilewidth = se.x - nw.x;
      const ident = this.matrixIds[zoom].identifier;
      const tilematrix = this.wmtsParams.tilematrixset + ':' + ident;
      const X0 = this.matrixIds[zoom].topLeftCorner.lng;
      const Y0 = this.matrixIds[zoom].topLeftCorner.lat;
      const tilecol = Math.floor((nw.x - X0) / tilewidth);
      const tilerow = -Math.floor((nw.y - Y0) / tilewidth);
      
      // Verifica que todos los parámetros estén presentes y definidos antes de usarlos
      if (!this._url || !this.wmtsParams.style || !this.wmtsParams.tilematrixset) {
          console.error("Faltan parámetros requeridos para construir la URL del tile.");
          return '';
      }

      const url = L.Util.template(this._url, {
          s: this._getSubdomain(coords),
          style: this.wmtsParams.style,
          TileMatrixSet: this.wmtsParams.tilematrixset // Incluye el parámetro TileMatrixSet
      });

      return (
          url +
          L.Util.getParamString(this.wmtsParams, url) +
          '&tilematrix=' +
          tilematrix +
          '&tilerow=' +
          tilerow +
          '&tilecol=' +
          tilecol
      );
  },

  setParams: function(params, noRedraw) {
      L.extend(this.wmtsParams, params);
      if (!noRedraw) {
          this.redraw();
      }
      return this;
  },

  getDefaultMatrix: function() {
      const matrixIds3857 = new Array(22);
      for (let i = 0; i < 22; i++) {
          matrixIds3857[i] = {
              identifier: '' + i,
              topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
          };
      }
      return matrixIds3857;
  }
});

L.tileLayer.wmts = function(url, options) {
  return new L.TileLayer.WMTS(url, options);
};
