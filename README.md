# 🌏 Web GIS Dashboard: Flood & Dark Spot Analysis

This is an interactive **Web GIS Dashboard** for visualizing and analyzing **flood-prone areas** and **dark spots** using satellite imagery and user-drawn features.  
It is built using **Leaflet.js**, **Chart.js**, and integrates **Sentinel Hub WMS** for satellite data.  

---

## 📋 Features

✅ Interactive web map with:
- OpenStreetMap and Esri Satellite base layers  
- Marker clustering for points  
- Drawing tools to digitize polygons, lines, and markers  
- Popups with metadata (Area Name, Issue Type, Notes)  

✅ Dashboard controls:
- Bar chart summarizing counts of Flood vs. Dark Spot areas  
- Export drawn features to GeoJSON file  
- Reset chart and clear drawn features  

✅ Satellite imagery:
- Select and overlay Sentinel-2 satellite imagery for specific dates
- Loading indicator while fetching satellite data  

✅ Legend to distinguish feature categories  

---

## 🚀 Technologies Used

- [Leaflet.js](https://leafletjs.com/) — interactive web maps  
- [Leaflet Draw](https://github.com/Leaflet/Leaflet.draw) — drawing and editing features  
- [Leaflet MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster) — clustering of markers  
- [Chart.js](https://www.chartjs.org/) — bar chart  
- [Sentinel Hub WMS](https://www.sentinel-hub.com/) — satellite imagery service  

---

## 📂 Project Structure

