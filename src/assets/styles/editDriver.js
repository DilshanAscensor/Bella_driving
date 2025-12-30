import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: scale(16),
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: '#122948',
        marginBottom: verticalScale(15),
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: verticalScale(20),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowRadius: scale(6),
        elevation: 3,
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#FFA500',
        marginBottom: verticalScale(12),
    },
    labels: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: '#122948',
        marginBottom: verticalScale(5),
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: scale(8),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(15),
        marginBottom: verticalScale(12),
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFA500',
        paddingVertical: verticalScale(14),
        borderRadius: scale(25),
        marginBottom: verticalScale(20),
    },
    saveButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginLeft: scale(8),
    },
    imageWrapper: {
        width: '100%',
        height: verticalScale(160),
        marginBottom: verticalScale(12),
        borderRadius: scale(12),
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: moderateScale(12),
        color: '#FFA500',
        marginTop: verticalScale(5),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: scale(10),
    },
});

