import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get query parameters from the request and ensure they are strings
  const position = typeof req.query.position === 'string' ? req.query.position : req.query.position?.[0];
  const distance = typeof req.query.distance === 'string' ? req.query.distance : req.query.distance?.[0];
  let queryParams = '';

  // Construct query parameters if they are provided
  if (position || distance) {
    const params = new URLSearchParams();
    if (position) params.append('position', position);
    if (distance) params.append('distance', distance);
    queryParams = `?${params.toString()}`;
  }

  try {
    const response = await fetch(`https://api.careerplug.com/jobs${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.URoFxHsRXMDP9pI6L8hKmAnoEXIcs8vKju58FdzLPKU}`, // Use environment variable for the token
      },
    });

    if (!response.ok) {
      throw new Error(`Error from CareerPlug API: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
