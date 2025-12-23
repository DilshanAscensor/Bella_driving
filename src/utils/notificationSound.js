import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const playOrderSound = () => {
    const sound = new Sound(
        'order_notification.mp3',
        Sound.MAIN_BUNDLE,
        (error) => {
            if (error) {
                console.log('Sound load error', error);
                return;
            }
            sound.play(() => {
                sound.release();
            });
        }
    );
};
