import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const CustomButtonControl = ({
  iconImage,
  innerHTML,
  iconClassName,
  onClick: onClickFunction,
  postion,
  buttonStyle,
}) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.extend({
      onAdd: function (map) {
        const element = L.DomUtil.create("button", "custom-control");
        if (iconImage) {
          const img = L.DomUtil.create("img");
          img.src = iconImage;
          img.style.width = "90%";
          img.style.height = "auto";
          element.appendChild(img);
        }
        if (innerHTML) {
          element.innerHTML = innerHTML;
        }
        if (iconClassName) {
          const icon = L.DomUtil.create("i", iconClassName);
          element.appendChild(icon);
        }
        if (onClickFunction) {
          element.onclick = onClickFunction;
        }

        if (buttonStyle) {
          Object.assign(element.style, buttonStyle);
        }

        return element;
      },
      onRemove: function (map) {},
    });

    const customControl = new control({ position: postion || "bottomright" });
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [iconImage, onClickFunction, buttonStyle]);
  return null;
};

export default CustomButtonControl;
