import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; 
import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import $ from 'jquery';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jobId = typeof req.query.jobId === 'string' ? req.query.jobId : null;

  try {
    // Fetch the API key using GraphQL
    const { data } = await client.query({
      query: gql`
        query GetAPIKey {
          siteSettings {
            siteSettings {
              careerplugApiKey
            }
          }
        }
      `,
    });
    
    const api_data = {
      "client_secret": "ICQmNDK4rIXCYPn7jRVX2SmaRrktOPyvvT6m3N57tqM",
      "client_id": "vXoZDKq1bwAzM5H2vkEvB3YavPOoVTmiqrSrnhz_lfg",
      "grant_type": "client_credentials"
    };
    const token_req = await fetch(`https://app.careerplug.com/oauth/token`, {
    method:'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(api_data)
  });
  const token:any = await token_req.json();
console.log(token);

const apiKey = data.siteSettings.siteSettings.careerplugApiKey;
    if (!apiKey) {
      throw new Error('API key not found');
    }

    let response;

    if (jobId) {
      // Fetching a single job
      response = await fetch(`https://api.careerplug.com/jobs/${jobId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
    } else {
      // Fetching all jobs
      const position = typeof req.query.position === 'string' ? req.query.position : req.query.position?.[0];
      const distance = typeof req.query.distance === 'string' ? req.query.distance : req.query.distance?.[0];
      
      let queryParams = '';

      if (position || distance) {
        const params = new URLSearchParams();
        if (position) params.append('postal_code', position);
        if (distance) params.append('postal_code_radius', distance);
        queryParams = `?${params.toString()}`;
        console.log(queryParams);
      }

      response = await fetch(`https://api.careerplug.com/jobs${queryParams}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
    }

    if (!response.ok) {
      throw new Error(`Error from CareerPlug API: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
