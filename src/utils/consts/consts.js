const ATTRIBUTIONS_LIST = {
  CartoDb:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  CyclOSM:
    '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  EsriWorldImagery:
    "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  EsriWorldTopoMap:
    "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  OSM: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  OSMHot:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  OpenTopo:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  Stadia:
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  ThunderForest:
    '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  USGS: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
};

export const tileLayers = {
  baseLayers: {
    default: {
      map: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: ATTRIBUTIONS_LIST.OSM,
    },
    blackWhite: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
    osmManik: {
      map: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    //   map: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: ATTRIBUTIONS_LIST.OSM,
    },
    openTopoMap: {
      map: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: ATTRIBUTIONS_LIST.OpenTopo,
    },
    stadia: {
      map: {
        Watercolors:
          "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
      },
      attribution: ATTRIBUTIONS_LIST.Stadia,
    },
    esri: {
      worldImagery: {
        map: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: ATTRIBUTIONS_LIST.EsriWorldImagery,
      },
    },
  },
  overlayers: {
    openSeaMap: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
    openPtMap: "http://openptmap.org/tiles/{z}/{x}/{y}.png",
    openRailway:
      "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    wayMarkedTrails: {
      hiking: "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
      cycling: "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
      mtb: "https://tile.waymarkedtrails.org/mtb/{z}/{x}/{y}.png",
      slopes: "https://tile.waymarkedtrails.org/slopes/{z}/{x}/{y}.png",
    },
    openSnowMap: "https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png",
  },
};

export const tileLayersWMS = {
  mundialis: {
    baseUrl: "http://ows.mundialis.de/services/service?",
    layers: {
      dark: "Dark",
      osmWMS: "OSM-WMS",
      osmOverlayWMS: "OSM-Overlay-WMS",
      topoWMS: "TOPO-WMS",
      topoOsmWMS: "TOPO-OSM-WMS",
      srtmThirtyColored: "SRTM30-Colored",
      srtmThirtyColoredHillshade: "SRTM30-Colored-Hillshade",
    },
  },
};