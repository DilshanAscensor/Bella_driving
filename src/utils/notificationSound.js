import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let orderSound = null;
let soundTimeout = null;

export const playOrderSound = () => {
    if (orderSound) return;

    orderSound = new Sound(
        'order_notification.mp3',
        Sound.MAIN_BUNDLE,
        (error) => {
            if (error) {
                console.log('Sound load error', error);
                orderSound = null;
                return;
            }

            orderSound.setNumberOfLoops(-1);
            orderSound.play();
        }
    );

    soundTimeout = setTimeout(() => {
        stopOrderSound();
    }, 30000);
};

export const stopOrderSound = () => {
    if (orderSound) {
        orderSound.stop(() => {
            orderSound.release();
            orderSound = null;
        });
    }

    if (soundTimeout) {
        clearTimeout(soundTimeout);
        soundTimeout = null;
    }
};
