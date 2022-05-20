import http from "./httpService";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

export const saveReservation = (data) => {
    return http.post(`${apiEndpoint}/reservations`, data);
}
