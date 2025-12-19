import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {LocationAccuracy} from 'expo-location';
import {store} from '../store/store';
import {setCoordinates} from '../store/locationSlice';

export const BACKGROUND_LOCATION_TASK = 'background-location-updates';

let backgroundLocationStarted = false;

TaskManager.defineTask(BACKGROUND_LOCATION_TASK,async ({data,error}) => {
    if(error){
        if (error.code === 0 || error.code === 1) {
            // Silencieux - ces erreurs sont normales pendant l'initialisation
            return;
        }
        console.error('Background location error:', error);
        return;
    }

    const { locations } = data as { locations: Location.LocationObject[] };

    if(locations && locations.length > 0) {
        const location = locations[locations.length - 1];
        const {latitude, longitude} = location.coords;
        store.dispatch(setCoordinates({ latitude, longitude }));
    }
});

export async function startBackgroundLocation(){
    try {
        if(backgroundLocationStarted){
            console.log('Background location already started');
            return;
        }

        await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK,{
            accuracy: LocationAccuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 50,
            deferredUpdatesInterval: 10000,
            showsBackgroundLocationIndicator:true,
        });
        backgroundLocationStarted = true;
        console.log('Background location started');
    } catch (error) {
        console.error('Failed to start background location:', error);
    }
}

export async function stopBackgroundLocation(){
    try {
        if(!backgroundLocationStarted){
            console.log('Background location was not started, nothing to stop');
            return;
        }
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        backgroundLocationStarted = false;
        console.log('Background location stopped');
    } catch (error) {
        console.error("Error stopping background location:", error);
    }
}
