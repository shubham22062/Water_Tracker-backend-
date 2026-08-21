import mongoose, { Document, Schema } from "mongoose";

export interface IIntakeLog extends Document {
  user: mongoose.Types.ObjectId;

  amount: number;

  date: Date;

  createdAt: Date;
  updatedAt: Date;
}

const intakeLogSchema = new Schema<IIntakeLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Water amount is required"],
      min: [1, "Water amount must be greater than 0"],
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

intakeLogSchema.index({
  user: 1,
  date: -1,
});

const IntakeLog = mongoose.model<IIntakeLog>(
  "IntakeLog",
  intakeLogSchema
);

export default IntakeLog;