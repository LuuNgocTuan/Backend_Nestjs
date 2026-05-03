import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    password!: string;

    @Prop()
    age?: number;

    @Prop()
    gender?: string;

    @Prop()
    address?: string;

    @Prop()
    phone?: string;

    @Prop({ default: 'USER', enum: ['USER', 'ADMIN', 'ENGINEER', 'OPERATOR', 'VIEWER'] })
    role?: string;

    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            name: String,
        },
    })
    company?: {
        _id: Types.ObjectId;
        name: string;
    }

    @Prop()
    refreshToken?: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    // @Prop()
    // deletedAt: Date;

    // @Prop()
    // isDeleted: boolean;
    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            email: String,
        },
    })
    createdBy?: {
        _id: Types.ObjectId;
        email: string;
    }

    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            email: String,
        },
    })
    updatedBy?: {
        _id: Types.ObjectId;
        email: string;
    }

    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            email: String,
        },
    })
    deletedBy?: {
        _id: Types.ObjectId;
        email: string;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

// 👇 GẮN plugin ở đây
UserSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

