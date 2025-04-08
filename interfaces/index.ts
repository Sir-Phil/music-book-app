export interface IArtist {
    _id?: string;
    name: string;
    bio?: string;
    genres: string[];
    availability?: boolean;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IEvent {
    _id?: string;
    title: string;
    date: Date;
    location: string;
    description?: string;
    artist: string; // Reference to an Artist (_id)
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IBooking {
    _id?: string;
    artist: string; // Reference to an Artist (_id)
    event: string;  // Reference to an Event (_id)
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ILoginRequest {
    email: string;
    password: string;
  }
  