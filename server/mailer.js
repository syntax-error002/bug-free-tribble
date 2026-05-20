/**
 * Sends a welcome notification (logs to console for local-only development)
 * @param {string} email - Recipient email address
 * @param {string} referralCode - The subscriber's unique referral code
 * @param {string} clientOrigin - Client web URL for referral link
 */
export async function sendWelcomeEmail(email, referralCode, clientOrigin = 'http://localhost:5173') {
  const referralLink = `${clientOrigin}?ref=${referralCode}`
  
  console.log('\n┌──────────────────────────────────────────────────────────────┐')
  console.log('│ 📬 DEVELOPER EMAIL LOG (Local Console Delivery Mode)        │')
  console.log('├──────────────────────────────────────────────────────────────┤')
  console.log(`│ Recipient:  ${email}`)
  console.log(`│ Code:       ${referralCode}`)
  console.log(`│ Share Link: ${referralLink}`)
  console.log('│                                                              │')
  console.log('│ Promo:      Unlock 1 Month Nexora Premium when 5 join!       │')
  console.log('└──────────────────────────────────────────────────────────────┘\n')
  return true
}

/**
 * Sends a passwordless OTP verification notification (logs to console for local-only development)
 * @param {string} email - Recipient email address
 * @param {string} otp - The 6-digit OTP code
 * @param {string} clientOrigin - Client web URL
 */
export async function sendOTPEmail(email, otp, clientOrigin = 'http://localhost:5173') {
  console.log('\n┌──────────────────────────────────────────────────────────────┐')
  console.log('│ 📬 DEVELOPER OTP EMAIL LOG (Local Console Delivery Mode)     │')
  console.log('├──────────────────────────────────────────────────────────────┤')
  console.log(`│ Recipient:  ${email}`)
  console.log(`│ OTP Code:   ${otp}`)
  console.log('│ Validity:   10 Minutes                                       │')
  console.log('└──────────────────────────────────────────────────────────────┘\n')
  return true
}
