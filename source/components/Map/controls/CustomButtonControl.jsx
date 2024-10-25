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
        const wrapper = L.DomUtil.create("span", "tooltip-wrapper");
        wrapper.setAttribute("data-direction", "left");
        wrapper.setAttribute("data-tooltip", title);

        const element = L.DomUtil.create("div", "leaflet-bar");

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
        wrapper.appendChild(element);
        return wrapper;
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
