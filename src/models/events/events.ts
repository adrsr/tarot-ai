export type EventError = {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  errors?: Record<string, EventError>;
};

export type AcknowledgeError = {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  errors?: Record<string, AcknowledgeError>;
};

export type Acknowledgement<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: AcknowledgeError;
};

export type Acknowledge<T> = (ack: Acknowledgement<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertEventError(error: any): asserts error is EventError {
  if (error instanceof Error || !error.code || !error.message) {
    console.error(error);
    throw new Error('Unexpected error');
  }
}
