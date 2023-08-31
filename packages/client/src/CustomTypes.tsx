export interface ErrorWithShortMessage {
  shortMessage: string;
}

export interface LogMessage {
  timestamp: number;
  message: string;
}

export interface ActivityLogState {
  messages: LogMessage[];
}