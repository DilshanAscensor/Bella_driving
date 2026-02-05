import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '../theme/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoWrapper: {
        width: 130,
        height: 130,
        borderRadius: 28,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,

        // subtle professional shadow
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },

    logo: {
        width: 90,
        height: 90,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    subtitle: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});
