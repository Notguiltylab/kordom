/**
 * Payment integration point (INTENTIONALLY NOT IMPLEMENTED).
 *
 * This prototype ships without a real payment gateway per the project spec —
 * payment is one of the pieces meant to be added later by the engineering team
 * that takes this over (e.g. 토스페이먼츠, 이니시스, KG이니시스, PortOne/아임포트).
 *
 * Every place in the UI that will eventually charge money (interpreter escort
 * fees, lawyer rights-analysis report fees, agent premium listing exposure)
 * calls `createPayment()` below and renders <PaymentStub /> instead of a working
 * checkout. Swap this one function for a real PG SDK call and everything
 * upstream keeps working unchanged.
 */

export interface PaymentRequest {
  amountKrw: number;
  description: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  ok: false;
  reason: 'NOT_IMPLEMENTED';
}

export async function createPayment(_request: PaymentRequest): Promise<PaymentResult> {
  return { ok: false, reason: 'NOT_IMPLEMENTED' };
}
