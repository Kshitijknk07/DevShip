import mongoose, { Document, Schema } from 'mongoose';

export interface IFile {
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface IProject extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  files: IFile[];
  language: string;
  isPublic: boolean;
  shareId: string;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  path: {
    type: String,
    required: true
  }
});

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  files: [fileSchema],
  language: {
    type: String,
    default: 'javascript'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate share ID before saving
projectSchema.pre('save', function(next) {
  if (!this.shareId) {
    this.shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  next();
});

export const Project = mongoose.model<IProject>('Project', projectSchema); 