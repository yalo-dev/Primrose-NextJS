export interface School {
    id: number;
    name: string;
    address: string;
    hours: string;
    notes: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }


const schools = [
    {
      id: 1,
      name: "Primrose School of Druid Hills",
      address: "2910 N Druid Hills Rd, Atlanta, GA 30329",
      hours: "M-F 7:00AM-6:00PM",
      phone: "(404) 945 9283",
      notes: "Opening Month XX",
      coordinates: {
        lat: 33.81738664852172,
        lng:  -84.31008514232843
      }
    },
    {
      id: 2,
      name: "Primrose School of Brookhaven",
      address: "3575 Durden Dr NE, Atlanta, GA 30319",
      hours: "M-F 7:00AM-6:00PM",
      phone: "(404) 945 9283",
      notes: "Corporate Child Care",
      coordinates: {
        lat: 33.89145757830399, 
        lng: -84.3215737
      }
    },
    {
      id: 3,
      name: "Primrose School of Peachtree Corners",
      address: "6325 Primrose Hill Ct, Peachtree Corners, GA 30092",
      hours: "M-F 7:00AM-6:00PM",
      phone: "(404) 945 9283",
      notes: "Opening Month XX",
      coordinates: {
        lat: 33.9646805171181,
        lng: -84.25486454232845
      }
    },
    {
      id: 4,
      name: "Primrose School of Buckhead",
      address: "3355 Lenox Rd NE, Atlanta, GA 30326",
      hours: "M-F 7:00AM-6:00PM",
      phone: "(404) 945 9283",
      notes: "Now Enrolling for Fall 2023",
      coordinates: {
        lat: 33.84672027867874, 
        lng: -84.35893144232844
      }
    }
  ];
  
  export default schools;
  