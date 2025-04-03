import mongoose, { Schema, Document } from "mongoose";
import jwt, {SignOptions} from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces";
import dotenv from "dotenv";

dotenv.config();


// Define the schema
const UserSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.generateToken = function (): string {
    const payload = { id: this._id.toString() };
  
    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES as SignOptions["expiresIn"], // Correct type cast
    };
  
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, options);
  };


// ✅ Fix: Explicitly define `this` as IUser
UserSchema.methods.comparePassword = async function (
    this: IUser,
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Define the model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
