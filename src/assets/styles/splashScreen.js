import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(25),
    },
    logoCircle: {
        padding: scale(35),
        borderRadius: scale(120),
        marginBottom: verticalScale(25),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    logo: {
        width: scale(110),
        height: scale(110),
    },
    title: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: verticalScale(6),
    },
    subtitle: {
        fontSize: moderateScale(15),
        textAlign: 'center',
        opacity: 0.85,
        lineHeight: verticalScale(20),
    },
});
