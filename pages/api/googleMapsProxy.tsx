// pages/api/googleMapsProxy.js
export default async function handler(req, res) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const baseUrl = `https://maps.googleapis.com/maps/api`;
  
    // Forward the client's request (with your API key appended)
    const response = await fetch(`${baseUrl}${req.url}?key=${apiKey}`);
    const data = await response.json();
  
    res.json(data);
  }
  