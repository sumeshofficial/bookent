import { useState } from 'react';

const useGeoLocation = () => {

    const [ locationInfo, setLocationInfo ] = useState(null);
    const [ locationError, setLocationError ] = useState(null);

    const { geolocation } = navigator;

    const success = (res) => {
        setLocationInfo(res.coords);
    }

    const error = (res) => {
        setLocationError(res.message);
    }

    if(!locationInfo && !locationError) {
        geolocation.getCurrentPosition(success, error)
    }

    return {locationError, locationInfo};
}

export default useGeoLocation;
