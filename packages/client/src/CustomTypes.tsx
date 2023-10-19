export interface ErrorWithShortMessage {
  cause: {
    data : {
      args: string[]
    }
  }
}

export interface LogMessage {
  timestamp: number;
  message: string;
}

export interface ActivityLogState {
  messages: LogMessage[];
}