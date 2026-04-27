import mongoose, { Schema, model, models } from 'mongoose';

export interface IQuestion {
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email';
  required: boolean;
}

export interface IJob {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: 'open' | 'closed';
  questions: IQuestion[];
  requestForgUsername: boolean;
  forgUsernameRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  label: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'url', 'email'], default: 'text' },
  required: { type: Boolean, default: true },
});

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    questions: [QuestionSchema],
    requestForgUsername: { type: Boolean, default: false },
    forgUsernameRequired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Job = models.Job || model<IJob>('Job', JobSchema);

export default Job;
