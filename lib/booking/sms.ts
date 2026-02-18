// SMS via Twilio — disabled in this deployment. Add twilio package to re-enable.
import type { BookingRecord, BookingService } from '@/lib/types';

export async function sendBookingSms(_params: {
  booking: BookingRecord;
  service?: BookingService;
  message: string;
  adminRecipients?: string[];
}) {
  console.warn('SMS not configured. Twilio integration is disabled.');
}
