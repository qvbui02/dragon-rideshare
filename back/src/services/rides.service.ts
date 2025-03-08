import { Request } from "express";

/**
 * Fetches all rides with optional filtering & sorting.
 * Returns an array of rides or throws an error.
 */
export async function getAllRides(req: Request, db: any) {
  try {
    const {
      source,
      destination,
      mode_of_transport,
      departure_date,
      max_passengers,
      sort_by = "departure_time",
      sort_order = "ASC",
      search,
    } = req.query;

    // Base query with left join on trip_members to compute available_seats
    let query = `
      SELECT 
        t.trip_id,
        u.full_name AS created_by_name,
        t.source,
        t.destination,
        t.source_radius,
        t.destination_radius,
        t.mode_of_transport,
        t.departure_time,
        t.departure_date,
        t.max_passengers,
        t.hours,
        (t.max_passengers - COUNT(tm.user_id)) AS available_seats
      FROM trips t
      JOIN users u ON t.created_by = u.user_id
      LEFT JOIN trip_members tm ON t.trip_id = tm.trip_id
      WHERE t.is_active = 1
    `;

    // Collect conditions and parameters for WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (source) {
      conditions.push("LOWER(t.source) LIKE ?");
      params.push(`%${(source as string).toLowerCase()}%`);
    }
    if (destination) {
      conditions.push("LOWER(t.destination) LIKE ?");
      params.push(`%${(destination as string).toLowerCase()}%`);
    }
    if (mode_of_transport) {
      conditions.push("t.mode_of_transport = ?");
      params.push(mode_of_transport);
    }
    if (departure_date) {
      // Compare just the date portion
      conditions.push("DATE(t.departure_date) = ?");
      params.push(departure_date);
    }
    if (max_passengers) {
      conditions.push("t.max_passengers >= ?");
      params.push(parseInt(max_passengers as string, 10));
    }
    if (search) {
      // Search both source & destination
      conditions.push("(LOWER(t.source) LIKE ? OR LOWER(t.destination) LIKE ?)");
      const searchTerm = `%${(search as string).toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }

    // If any conditions exist, append them
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    // Group by to make COUNT(...) in SELECT valid
    query += `
      GROUP BY 
        t.trip_id, 
        u.full_name, 
        t.source, 
        t.destination, 
        t.source_radius, 
        t.destination_radius, 
        t.mode_of_transport, 
        t.departure_time, 
        t.departure_date, 
        t.max_passengers, 
        t.hours
    `;

    // Sort handling
    const validSortFields = ["departure_time", "hours"];
    const sortField = validSortFields.includes(sort_by as string)
      ? sort_by
      : "departure_time";
    const sortDir = sort_order === "DESC" ? "DESC" : "ASC";

    query += ` ORDER BY ${sortField} ${sortDir}`;

    // Execute the query
    const rides = await db.all(query, params);
    return rides; // Return the array (could be empty if none found)
  } catch (error) {
    console.error("Error fetching trips:", error);
    // Throw an error so the route can catch it and return a 500
    throw new Error("Server error");
  }
}

/**
 * Adds the current user to a trip, if not already joined.
 */
export const joinTrip = async (req: Request, res: any, db: any) => {
  const { trip_id } = req.body;
  const userId = (req as any).user?.id;

  if (!trip_id) {
    console.error("Error: Trip ID is missing in request body");
    return res.status(400).json({ error: "Trip ID is required" });
  }

  try {
    const existingMember = await db.get(
      "SELECT * FROM trip_members WHERE trip_id = ? AND user_id = ?",
      [trip_id, userId]
    );

    if (existingMember) {
      return res.status(400).json({ error: "You have already joined this trip" });
    }

    await db.run(
      "INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)",
      [trip_id, userId]
    );

    return res.status(200).json({ message: "Successfully joined the trip" });
  } catch (error) {
    console.error("joinTrip error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
