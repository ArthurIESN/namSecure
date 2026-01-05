import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {LocationAccuracy} from 'expo-location';
import {store} from '../store/store';
import {setCoordinates} from '../store/locationSlice';

export const BACKGROUND_LOCATION_TASK = 'background-location-updates';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK,async ({data,error}) => {
    if(error){
        if (error.code === 0 || error.code === 1) {
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
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if(isRegistered){
            return;
        }

        await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK,{
            accuracy: LocationAccuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 50,
            deferredUpdatesInterval: 10000,
            showsBackgroundLocationIndicator:true,
        });
    } catch (error) {
        console.error('Failed to start background location:', error);
    }
}

export async function stopBackgroundLocation(){
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if(!isRegistered){
            return;
        }
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    } catch (error) {
        console.error("Error stopping background location:", error);
    }
}
