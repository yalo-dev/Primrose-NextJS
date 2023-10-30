export interface School {
    id: number;
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }


const schools = [
    {
      id: 1,
      name: "School A",
      address: "123 Main St, City, GA",
      coordinates: {
        lat: 33.748995,
        lng: -84.387982
      }
    },
    {
      id: 2,
      name: "School B",
      address: "456 Elm St, City, GA",
      coordinates: {
        lat: 33.749995,
        lng: -84.388982
      }
    },
    {
      id: 3,
      name: "School C",
      address: "789 Pine St, City, GA",
      coordinates: {
        lat: 33.750995,
        lng: -84.389982
      }
    },
    {
      id: 4,
      name: "School D",
      address: "101 Maple St, City, GA",
      coordinates: {
        lat: 33.751995,
        lng: -84.390982
      }
    }
  ];
  
  export default schools;
  