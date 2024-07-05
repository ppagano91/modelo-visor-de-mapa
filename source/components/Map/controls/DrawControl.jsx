import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '../../../styles/plugins/leaflet-draw.css';
import "../../../plugins/leaflet-draw.js";

const DrawToolbar = () => {
    const map = useMap();
  
    useEffect(() => {
      // Personalizar textos del controlador de dibujo
        L.drawLocal = {
            draw: {
                toolbar: {
                    actions: {
                        title: "Cancelar dibujo",
                        text: "Cancelar"
                    },
                    finish: {
                        title: "Finalizar dibujo",
                        text: "Finalizar"
                    },
                    undo: {
                        title: "Borrar el último punto dibujado",
                        text: "Borrar último punto"
                    },
                    buttons: {
                        polyline: "Dibujar una polilínea",
                        polygon: "Dibujar un polígono",
                        rectangle: "Dibujar un rectángulo",
                        circle: "Dibujar un círculo",
                        marker: "Colocar un marcador",
                        circlemarker: "Colocar un marcador circular"
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: "Haga clic y arrastre para dibujar el círculo."
                        },
                        radius: "Radio"
                    },
                    circlemarker: {
                        tooltip: {
                            start: "Haga clic para colocar el marcador circular."
                        }
                    },
                    marker: {
                        tooltip: {
                            start: "Haga clic para colocar el marcador."
                        }
                    },
                    polygon: {
                        tooltip: {
                            start: "Haga clic para comenzar a dibujar la figura.",
                            cont: "Haga clic para continuar dibujando la figura.",
                            end: "Haga clic en el primer punto para cerrar esta figura."
                        }
                    },
                    polyline: {
                        error: "<strong>Error:</strong> los bordes de la figuras no se pueden cruzar!",
                        tooltip: {
                            start: "Haga clic para comenzar a dibujar la línea.",
                            cont: "Haga clic para continuar dibujando la línea.",
                            end: "Haga clic en el último punto para terminar la línea."
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: "Haga clic y arrastre para dibujar el rectángulo."
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: "Suelte el mouse para terminar de dibujar."
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: "Guardar cambios",
                            text: "Guardar"
                        },
                        cancel: {
                            title: "Descartar todos los cambios",
                            text: "Cancelar"
                        },
                        clearAll: {
                            title: "Borrar todas las figuras",
                            text: "Borrar todo"
                        }
                    },
                    buttons: {
                        edit: "Editar figuras",
                        editDisabled: "No hay figuras para editar",
                        remove: "Borrar figuras",
                        removeDisabled: "No hay figuras para borrar"
                    }
                },
                handlers: {
                    edit: {
                        tooltip: {
                            text: "Arrastre los puntos o marcadores para modificar las figuras.",
                            subtext: "Haga clic en cancelar para deshacer los cambios."
                        }
                    },
                    remove: {
                        tooltip: {
                            text: "Haga clic sobre la figura para eliminarla."
                        }
                    }
                }
            }
        }
  
      // Inicializar la barra de herramientas de dibujo con textos personalizados
      const drawControl = new L.Control.Draw({
        position: "bottomright",
        edit: {
          featureGroup: new L.FeatureGroup().addTo(map),
        },
        // draw: {
        //   polygon: {
        //     shapeOptions: {
        //       color: '#bada55',
        //     },
        //     allowIntersection: false,
        //     drawError: {
        //       color: '#e1e100',
        //       message: '<strong>Error:</strong> No puede intersectar!',
        //     },
        //     showArea: true,
        //     metric: true,
        //     repeatMode: true,
        //   },
        //   polyline: {
        //     shapeOptions: {
        //       color: '#f357a1',
        //       weight: 10,
        //     },
        //   },
        //   circle: {
        //     shapeOptions: {
        //       color: '#662d91',
        //     },
        //   },
        //   rectangle: {
        //     shapeOptions: {
        //       color: '#ff0000',
        //     },
        //   },
        //   marker: true,
        //   circlemarker: true,
        // },
      });
  
      // Añadir la barra de herramientas de dibujo al mapa
      map.addControl(drawControl);
  
      // Event handler para guardar los elementos dibujados
      map.on(L.Draw.Event.CREATED, (event) => {
        const { layer } = event;
        const drawnItems = drawControl.options.edit.featureGroup;
        drawnItems.addLayer(layer);
      });
  
      return () => {
        map.removeControl(drawControl);
      };
    }, [map]);
  
    return null;
  };
  
  export default DrawToolbar;