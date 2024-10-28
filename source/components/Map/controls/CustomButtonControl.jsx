import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const CustomButtonControl = ({
  iconImage,
  innerHTML,
  iconClassName,
  onClick: onClickFunction,
  postion,
  anchorStyle,
  className,
  title,
}) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.extend({
      onAdd: function (map) {
        const element = L.DomUtil.create("div", "leaflet-bar");
        
        element.setAttribute("data-direction", "left");
        element.setAttribute("data-tooltip", title);
        if (className) {
          L.DomUtil.addClass(element, className);
        }
        if (iconImage) {
          const img = L.DomUtil.create("a");
          img.src = iconImage;
          element.appendChild(img);
        }
        if (innerHTML) {
          element.innerHTML = innerHTML;
        }
        if (iconClassName) {
          const icon = L.DomUtil.create("a", iconClassName);
          Object.assign(icon.style, anchorStyle);
          element.appendChild(icon);
        }
        if (onClickFunction) {
          element.onclick = onClickFunction;
        }
        return element;
      },
      onRemove: function (map) { },
    });

    const customControl = new control({ position: postion || "bottomright" });
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [iconImage, onClickFunction, className]);

  return null;
};

export default CustomButtonControl;
