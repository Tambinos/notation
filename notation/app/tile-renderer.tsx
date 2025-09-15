import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import {Coordinates} from "../models/coordinates";

type TileRendererProps = {
    coordinate: Coordinates;
    showMarker?: boolean;
    size?: { width?: number | string; height?: number };
};

export default function TileRenderer({
                                         coordinate,
                                         showMarker = true,
                                         size = { width: "100%", height: 200 },
                                     }: TileRendererProps) {
    const webviewRef = useRef(null);

    const { latitude, longitude } = coordinate;

    const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
      #map { border-radius: 10px; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      const map = L.map('map', { zoomControl: false, attributionControl: false })
        .setView([${latitude}, ${longitude}], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      ${showMarker ? `L.marker([${latitude}, ${longitude}]).addTo(map);` : ""}
    </script>
  </body>
  </html>
  `;

    return (
        <View style={[styles.container, { width: size.width, height: size.height }]}>
            <WebView
                ref={webviewRef}
                originWhitelist={["*"]}
                source={{ html: htmlContent }}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        borderRadius: 12,
    },
});
