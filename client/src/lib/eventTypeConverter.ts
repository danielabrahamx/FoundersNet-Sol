import { EventType } from '@/types/market'

/**
 * Convert numeric event type (from blockchain) to EventType enum
 * The Rust program stores event types as u8 with the following mapping:
 * 0 = Series A
 * 1 = Series B
 * 2 = Acquisition
 * 3 = IPO
 * 4 = Other
 */
export function numericToEventType(eventTypeNum: number): EventType | undefined {
  switch (eventTypeNum) {
    case 0:
      return EventType.SERIES_A
    case 1:
      return EventType.SERIES_B
    case 2:
      return EventType.ACQUISITION
    case 3:
      return EventType.IPO
    case 4:
      return EventType.OTHER
    default:
      return undefined
  }
}

/**
 * Convert EventType enum to numeric value for sending to blockchain
 */
export function eventTypeToNumeric(eventType: EventType): number {
  switch (eventType) {
    case EventType.SERIES_A:
      return 0
    case EventType.SERIES_B:
      return 1
    case EventType.ACQUISITION:
      return 2
    case EventType.IPO:
      return 3
    case EventType.OTHER:
      return 4
    default:
      return 4 // Default to OTHER
  }
}
