import mongoose, { Schema, model, models } from 'mongoose';

export interface IApplication {
  jobId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  forgUsername?: string;
  answers: { question: string, answer: string }[];
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    forgUsername: { type: String },
    answers: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ['pending', 'reviewed', 'rejected', 'accepted'], default: 'pending' },
  },
  { timestamps: true }
);

const Application = models.Application || model<IApplication>('Application', ApplicationSchema);

export default Application;
