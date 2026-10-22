const mode = import.meta.env.VITE_SUBSCRIPTION_PROVIDER || 'mock';
export const subscriptionStatuses = ['INACTIVE', 'PENDING', 'ACTIVE', 'FAILED', 'CANCELLED', 'EXPIRED'];

export const ideamartService = {
  async sendOtp(phone) { return { ok: true, provider: mode, message: `OTP sent to ${phone}` }; },
  async verifyOtp(phone, otp) { return { ok: mode === 'mock' ? otp === '1234' : false, provider: mode, phone }; },
  async resendOtp(phone) { return this.sendOtp(phone); },
  async checkSubscription() { return { status: 'INACTIVE', providerMode: mode }; },
  async subscribe(phone, serviceId) { return { status: 'PENDING', phone, serviceId, providerMode: mode, mock: mode === 'mock' }; },
  async unsubscribe(phone) { return { status: 'CANCELLED', phone, providerMode: mode }; },
  async getSubscriberStatus(phone) { return this.checkSubscription(phone); },
  async getOperator(phone) { return phone?.startsWith('+947') ? 'Dialog / Mobitel / Hutch (prefix estimate)' : 'Unknown'; }
};
