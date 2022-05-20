import Availabilities from '../Availabilities';
import CreateAvailability from '../Availabilities/createAvailability';

import { Navigate, useRoutes } from "react-router-dom";

const MainRoutes =  () => [

    {
        path: '/availabilities/create',
        element: <CreateAvailability />,
    },
    {
        path: '/availabilities',
        element: <Availabilities />,    
    },
    {
        path: '/',
        element: <Navigate to="/availabilities" replace />,    
    },
]

const Routes = () => {
    return useRoutes(MainRoutes());
}

export default Routes; 

