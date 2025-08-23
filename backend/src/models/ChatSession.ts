import mongoose, { Document, Schema } from "mongoose";
import { ChatMessage } from "../shared/chatTypes";

export interface IChatSession extends Document {
  _id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const ChatSessionSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    messages: [ChatMessageSchema],
  },
  {
    timestamps: true,
  }
);

export const ChatSession = mongoose.model<IChatSession>(
  "ChatSession",
  ChatSessionSchema
);
