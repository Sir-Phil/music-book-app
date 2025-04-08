import mongoose, { Schema, Document } from "mongoose";
import { IArtist } from "../interfaces";
import jwt, {SignOptions}  from "jsonwebtoken";
import bcrypt from "bcryptjs";



const ArtistSchema: Schema<IArtist> = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    bio: { 
        type: String
     },
    genres: { 
        type: [String], 
        required: true 
    },
    availability: { 
        type: Boolean, 
        default: true 
    },
    email: { type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

//Hash password
ArtistSchema.pre<IArtist>("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        next();
    } catch (error : any) {
        next(error);
    }
})


//jwt token
ArtistSchema.methods.getJwtToken = function (): string {
    const payload = { id: this._id.toString() };
  
    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES as SignOptions["expiresIn"], // Correct type cast
    };
  
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, options);
  };



//compare password
ArtistSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean>{
    const artist = this as IArtist
    return await bcrypt.compare(enteredPassword, artist.password);
}

const Artist = mongoose.model<IArtist>("Artist", ArtistSchema);

export default Artist
