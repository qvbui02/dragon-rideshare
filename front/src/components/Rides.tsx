import React, { useEffect, useState } from "react";
import axios from "axios";

const Rides: React.FC = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get("/api/rides");
                console.log(response.data.rides);
                setRides(response.data.rides); 
            } catch (err) {
                setError("Error fetching trips");
                console.error(err);
            }
        };

        fetchRides();
    }, []);

    return (
        <div>
            <h1>All Trips</h1>
            {error && <p>{error}</p>}
            {rides.length > 0 ? (
                <ul>
                    {rides.map((ride, index) => (
                        <li key={index}>
                            <strong>Trip {index + 1}:</strong>
                            <p>Created by: {ride.created_by_name}</p>
                            <p>From {ride.source} to {ride.destination}</p>
                            <p>Mode of transport: {ride.mode_of_transport}</p>
                            <p>Departure: {new Date(ride.departure_date).toLocaleString()}</p>
                            <p>Max passengers: {ride.max_passengers}</p>
                            <p>Hours: {ride.hours}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No trips available</p>
            )}
        </div>
    );
};

export default Rides;
