import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export default StyleSheet.create({
    ACCENT_COLOR: '#8DB600',

    container: { flex: 1, backgroundColor: '#fff' },

    header: { alignItems: 'center', padding: 16 },

    profileContainer: {
        width: scale(85),
        height: scale(85),
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 12,
    },

    profileImage: { width: '100%', height: '100%' },

    welcomeText: { fontSize: 20, fontWeight: '700', marginTop: 6 },

    subText: { fontSize: 14, color: '#666' },

    /* ===== ONLINE CARD ===== */
    onlineCard: {
        width: "90%",
        alignSelf: "center",
        backgroundColor: "#fff",
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderRadius: 18,
        marginTop: 25,

        // Floating premium shadow like screenshot
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    onlineStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    onlineLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 6,
    },

    onlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },

    onlineStateText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },

    onlineDescription: {
        marginTop: 8,
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 20,
        textAlign: "left",
    },

    onlineButton: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 40,
        alignItems: "center",

        // Button shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },

    onlineButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    /* ===== CARDS SHOWN AFTER ONLINE ===== */
    cardContainer: { paddingHorizontal: 16, marginTop: 25 },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 10,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },

    cardText: { marginLeft: 12, fontSize: 16, fontWeight: "600", color: '#333' },
});
