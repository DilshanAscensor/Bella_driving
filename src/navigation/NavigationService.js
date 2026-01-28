import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let pendingNavigation = null;

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    } else {
        // store navigation request until ready
        pendingNavigation = { name, params };
    }
}

export function onNavigationReady() {
    if (pendingNavigation && navigationRef.isReady()) {
        navigationRef.navigate(
            pendingNavigation.name,
            pendingNavigation.params
        );
        pendingNavigation = null;
    }
}
