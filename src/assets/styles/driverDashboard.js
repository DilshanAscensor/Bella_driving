import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scroll: { paddingBottom: scale(80) },

    headerCard: {
        margin: scale(15),
        padding: scale(15),
        borderRadius: 12,
        elevation: 4,
    },

    headerContent: { alignItems: 'center' },
    welcomeText: { marginTop: scale(10), fontWeight: '700', fontSize: scale(18) },
    subText: { marginTop: scale(3), color: '#666' },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: scale(15),
        marginTop: scale(15),
    },

    statsCard: {
        flex: 1,
        marginRight: scale(10),
        padding: scale(10),
        borderRadius: 12,
        elevation: 3,
    },

    statsCardLarge: {
        flex: 1,
        padding: scale(15),
        borderRadius: 12,
        elevation: 3,
    },

    statsValue: { fontSize: scale(22), fontWeight: '700', color: '#8DB600' },
    statsLabel: { fontSize: scale(13), color: '#444', marginTop: scale(5) },

    onlineCard: {
        margin: scale(15),
        padding: scale(20),
        borderRadius: 12,
        elevation: 4,
    },

    onlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    onlineDot: { width: scale(14), height: scale(14), borderRadius: 7, marginHorizontal: 8 },
    statusLabel: { fontWeight: '600', fontSize: scale(15) },
    statusState: { fontWeight: '700', fontSize: scale(15) },
    onlineDescription: { marginTop: scale(10), color: '#555' },

    onlineButton: { marginTop: scale(15), borderRadius: 40 },

    cardList: { marginTop: scale(20), paddingHorizontal: scale(15) },

    itemCard: {
        marginBottom: scale(15),
        borderRadius: 12,
        elevation: 3,
        backgroundColor: '#fff',
    },

    cardTitle: { fontSize: scale(16), fontWeight: '600', color: '#333' },
});
