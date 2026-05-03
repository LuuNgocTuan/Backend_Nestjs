import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
    @Prop()
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    description: string;

    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            email: String,
        },
    })
    createdBy: {
        _id: Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: Types.ObjectId;
        email: string;
    };

    @Prop()
    createdAt: Date;

    }

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});