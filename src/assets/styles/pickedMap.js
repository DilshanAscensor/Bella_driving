import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    pickupButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#28a745",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },
    pickupText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
