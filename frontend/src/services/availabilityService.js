import http from "./httpService";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

export const saveAvailability = (data) => {
    return http.post(`${apiEndpoint}/availabilities`, data);
}

export const getAll = () => {
    return http.get(`${apiEndpoint}/availabilities`);
}

export const getAvailabilityReservations = (id) => {
    return http.get(`${apiEndpoint}/availabilities/${id}/reservations`);

}