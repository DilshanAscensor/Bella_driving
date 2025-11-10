import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: verticalScale(40),
    },
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    logoContainer: {
        padding: scale(25),
        borderRadius: scale(100),
        marginBottom: verticalScale(15),
    },
    logo: {
        width: scale(90),
        height: scale(90),
    },
    title: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        marginBottom: verticalScale(6),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: moderateScale(15),
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(6),
        borderRadius: scale(15),
        marginVertical: verticalScale(8),
    },
    inputIcon: {
        marginRight: scale(10),
    },
    input: {
        flex: 1,
        fontSize: moderateScale(12),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(15),
        marginVertical: verticalScale(18),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonIcon: {
        marginRight: scale(8),
    },
    buttonText: {
        fontSize: moderateScale(17),
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(8),
    },
    footerText: {
        fontSize: moderateScale(13),
    },
    footerLink: {
        fontSize: moderateScale(13),
        fontWeight: '600',
    },


    // OTP Screen 

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: moderateScale(12), // better than space-between
        flexWrap: 'wrap',       // prevents overflow on small devices
        marginTop: verticalScale(30),
        marginBottom: verticalScale(20),
        alignSelf: 'center',
    },

    otpInput: {
        width: moderateScale(55),
        height: moderateScale(55),
        borderRadius: moderateScale(12),
        textAlign: 'center',
        fontSize: moderateScale(22),
        fontWeight: '700',
        backgroundColor: '#fff2', // overridden by your dynamic colors
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
});
