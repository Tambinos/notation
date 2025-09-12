import React, { useState, useRef } from "react";
import { View, Button, Modal, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function LocationPicker() {
    const [modalVisible, setModalVisible] = useState(false);
    const [marker, setMarker] = useState(null);
    const webviewRef = useRef(null);

    const handleConfirm = () => {
        setModalVisible(false);
        console.log("Selected marker:", marker);
    };

    // Receive coordinates from WebView
    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.latitude && data.longitude) {
                setMarker(data);
            }
        } catch (e) {
            console.log("Invalid message from WebView:", event.nativeEvent.data);
        }
    };

    const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      const map = L.map('map').setView([37.78825, -122.4324], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      let marker;
      map.on('click', function(e) {
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng, { draggable: true }).addTo(map);
          marker.on('dragend', function(event){
            const pos = event.target.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: pos.lat, longitude: pos.lng }));
          });
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: e.latlng.lat, longitude: e.latlng.lng }));
      });
    </script>
  </body>
  </html>
  `;

    return (
        <View style={{ flex: 1 }}>
            <Button title="Open Map" onPress={() => setModalVisible(true)} />

            <Modal visible={modalVisible} animationType="slide">
                <WebView
                    ref={webviewRef}
                    originWhitelist={["*"]}
                    source={{ html: htmlContent }}
                    onMessage={onMessage}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Confirm" onPress={handleConfirm} />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>

            {marker && (
                <Text style={styles.coordinates}>
                    Selected: {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    coordinates: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 16,
    },
});
