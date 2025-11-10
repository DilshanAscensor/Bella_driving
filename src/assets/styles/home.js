import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    gradient: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(40),
    },

    header: {
        alignItems: 'center',
        marginBottom: verticalScale(40),
    },

    logoContainer: {
        padding: moderateScale(25),
        borderRadius: moderateScale(100),
        marginBottom: verticalScale(15),
    },

    logo: {
        width: moderateScale(110),
        height: moderateScale(110),
    },

    title: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        letterSpacing: 0.4,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: verticalScale(6),
        lineHeight: moderateScale(20),
        opacity: 0.85,
        paddingHorizontal: scale(15),
    },

    buttonsContainer: {
        width: '100%',
        marginTop: verticalScale(10),
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(15),
        marginVertical: verticalScale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    buttonIcon: {
        marginRight: scale(10),
    },

    buttonText: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#fff',
    },

    footer: {
        alignItems: 'center',
        marginTop: verticalScale(25),
    },

    footerText: {
        fontSize: moderateScale(11),
        opacity: 0.65,
    },
});
