import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        padding: 30,
        borderRadius: 100,
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderRadius: 30,
        marginVertical: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 30,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});