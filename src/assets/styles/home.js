import { StyleSheet, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const IS_SMALL_WIDTH = width < 360;


const { height } = Dimensions.get('window');
const IS_SMALL_DEVICE = height < 700;

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(IS_SMALL_DEVICE ? 20 : 40),
        paddingBottom: verticalScale(32),
        alignItems: 'center',
    },

    hero: {
        alignItems: 'center',
        marginBottom: verticalScale(IS_SMALL_DEVICE ? 32 : 56),
    },

    logoWrapper: {
        width: moderateScale(IS_SMALL_DEVICE ? 120 : 160),
        height: moderateScale(IS_SMALL_DEVICE ? 120 : 160),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(24),
    },

    logo: {
        width: '70%',
        height: '70%',
    },

    welcomeTitle: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        marginBottom: verticalScale(6),
        textAlign: 'center',
    },

    tagline: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        letterSpacing: 2,
        color: '#ec932a',
    },

    subtitle: {
        fontSize: moderateScale(15),
        color: 'rgba(80, 80, 90, 0.82)',
        textAlign: 'center',
        lineHeight: moderateScale(24),
        paddingHorizontal: scale(16),
    },

    actionsWrapper: {
        width: '100%',
    },

    ctaButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(16),
        borderRadius: 10,
        marginBottom: verticalScale(14),
    },

    primaryButton: {
        backgroundColor: '#ec932a',
    },

    secondaryButton: {
        width: '100%',
        backgroundColor: 'rgba(198, 104, 27, 0.06)',
        borderWidth: 1.4,
        borderColor: 'rgba(198, 104, 27, 0.35)',
    },

    secondaryButtonFull: {
        backgroundColor: 'rgba(198, 104, 27, 0.06)',
        borderWidth: 1.2,
        borderColor: 'rgba(198, 104, 27, 0.35)',
    },

    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    ctaTextPrimary: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: '#ffffff',
        marginLeft: scale(10),
    },

    ctaTextSecondary: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#ec932a',
        marginLeft: 8,
        flexShrink: 1,
    },

    secondaryButtonsRow: {
        flexDirection: 'column',
        width: '100%',
        gap: 10,
        marginBottom: 10,
    },


    footer: {
        marginTop: verticalScale(24),
        marginBottom: verticalScale(8),
    },

    footerText: {
        fontSize: moderateScale(12.5),
        color: 'rgba(130, 130, 140, 0.7)',
        fontWeight: '500',
    },
});
