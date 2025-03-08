import { Request, Response } from 'express';
import axios from 'axios';

// Function to geocode an address and return latitude/longitude
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Google Maps API key not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status !== 'OK') {
            throw new Error(`Geocoding failed for address "${address}": ${response.data.status}`);
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
    } catch (error: any) {
        console.error(`Error geocoding address "${address}":`, error.message);
        throw error; // Re-throw to be caught by the caller
    }
};

export async function addRide(req: Request, res: Response, db: any) {
    const {
        source,
        destination,
        source_radius,
        destination_radius,
        mode_of_transport,
        departure_time,
        departure_date,
        max_passengers,
        hours
    } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
        throw new Error("User not authenticated");
    }

    if (!source || !destination || !mode_of_transport || !departure_time || !departure_date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Verify and geocode source and destination
        const sourceCoords = await geocodeAddress(source);
        if (!sourceCoords) {
            throw new Error(`Geocoding failed for source address "${source}"`);
        }

        const destCoords = await geocodeAddress(destination);
        if (!destCoords) {
            throw new Error(`Geocoding failed for destination address "${destination}"`);
        }

        const result = await db.run(
            `INSERT INTO trips (
                created_by, source, destination, source_latitude, source_longitude,
                destination_latitude, destination_longitude, source_radius, destination_radius,
                mode_of_transport, departure_time, departure_date, max_passengers, hours
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                source,
                destination,
                sourceCoords.lat,
                sourceCoords.lng,
                destCoords.lat,
                destCoords.lng,
                source_radius || null, // Use null if not provided
                destination_radius || null,
                mode_of_transport,
                departure_time,
                departure_date,
                max_passengers,
                hours || null
            ]
        );

        if (!result || !result.lastID) {
            throw new Error("Error saving the trip");
        }

        return { trip_id: result.lastID };
    } catch (error: any) {
        console.error(error);
        throw error; // Let the route handler catch and format the response
    }
}