import axios from 'axios';

export interface Mosque {
    id: number;
    name: string;
    address?: string; // New field for address
    lat: number;
    lon: number;
    distance?: number; // Distance in meters from user
}

export const MosqueService = {
    async getNearbyMosques(lat: number, lon: number, radiusStats: number = 1500): Promise<Mosque[]> {
        // List of Overpass API instances for fallback
        const servers = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter',
            'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
        ];

        // Optimized query: 
        // 1. Reduced timeout to 20s (fail fast to try next server)
        // 2. Reduced default radius to 1500m
        // 3. Removed 'relation' (rarely needed for simple points and heavy to process)
        // 4. Used 'out center;' to get just coordinates for ways, avoiding massive geometry data
        const query = `
            [out:json][timeout:20];
            (
              node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusStats},${lat},${lon});
              way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusStats},${lat},${lon});
            );
            out center;
        `;

        for (const server of servers) {
            try {
                // console.log(`Trying Overpass server: ${server}`);
                const response = await axios.post(server, query, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 20000 // Client timeout matching query
                });

                if (response.data && response.data.elements) {
                    const elements = response.data.elements;
                    const mosques: Mosque[] = [];

                    elements.forEach((element: any) => {
                        const mosqueLat = element.lat || element.center?.lat;
                        const mosqueLon = element.lon || element.center?.lon;
                        const tags = element.tags || {};

                        // Smarter Name Resolution
                        let name = tags.name || tags["name:tr"] || tags["name:en"] || tags.alt_name || tags.official_name || tags.int_name;

                        // Fallback to address if name is missing but street is known
                        if (!name && tags["addr:street"]) {
                            name = `${tags["addr:street"]} Camii (İsimsiz)`;
                        } else if (!name) {
                            name = "Bilinmeyen Cami";
                        }

                        // Address Construction
                        let address = "";
                        if (tags["addr:street"]) address += tags["addr:street"];
                        if (tags["addr:housenumber"]) address += " No:" + tags["addr:housenumber"];
                        if (tags["addr:suburb"]) address += (address ? ", " : "") + tags["addr:suburb"];

                        // Only add if we have valid coordinates
                        if ((element.type === 'node' || element.type === 'way') && mosqueLat && mosqueLon) {
                            mosques.push({
                                id: element.id,
                                name: name,
                                address: address || undefined,
                                lat: mosqueLat,
                                lon: mosqueLon,
                                distance: calculateDistance(lat, lon, mosqueLat, mosqueLon)
                            });
                        }
                    });

                    // Sort by distance
                    return mosques.sort((a, b) => (a.distance || 0) - (b.distance || 0));
                }
            } catch (error) {
                console.warn(`Failed to fetch from ${server}:`, error);
                // Continue to next server in loop
            }
        }

        // If all servers fail
        return [];
    }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
