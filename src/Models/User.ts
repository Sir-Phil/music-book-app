import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces";


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

// Generate JWT token
UserSchema.methods.getJwtToken = function (): string {
    const user = this as IUser;
    const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
    let expiresIn: string | number | undefined = process.env.JWT_EXPIRES;

    if (!secretKey) {
        throw new Error("Missing JWT_SECRET_KEY in environment variables.");
    }

    // Convert `expiresIn` to number if it's a valid numeric string
    if (expiresIn && !isNaN(Number(expiresIn))) {
        expiresIn = Number(expiresIn);
    }

    return jwt.sign(
        { id: user._id.toString() }, 
        secretKey, 
        { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] } // Type safety
    );
};
// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    const user = this.IUser
    return await bcrypt.compare(enteredPassword, user.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
