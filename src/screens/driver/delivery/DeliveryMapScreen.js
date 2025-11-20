import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

export default function DeliveryMapScreen({ route }) {
    const { dropoff } = route.params;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: dropoff.lat,
                    longitude: dropoff.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                provider={null} // IMPORTANT
            >

                {/* Free OpenStreetMap tiles */}
                <UrlTile
                    urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    tileSize={256}
                />

                <Marker
                    coordinate={{
                        latitude: dropoff.lat,
                        longitude: dropoff.lng,
                    }}
                    title="Delivery Location"
                    description={dropoff.address}
                />

            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});
