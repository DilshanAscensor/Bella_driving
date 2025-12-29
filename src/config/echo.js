import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";

export const echo = new Echo({
    broadcaster: "reverb",
    key: "local",
    wsHost: "YOUR_SERVER_IP",   // example: 192.168.1.10
    wsPort: 8080,
    forceTLS: false,
    encrypted: false,
    disableStats: true,
});
