import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logoCircle: {
        padding: 40,
        borderRadius: 120,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.85,
        lineHeight: 22,
    },
});
