export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, subject, message, recaptchaToken } = req.body

  // Verify reCAPTCHA token
  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
  })
  const verify = await verifyRes.json()

  if (!verify.success || verify.score < 0.5) {
    return res.status(400).json({ error: 'reCAPTCHA verification failed' })
  }

  // Forward to Formspree
  const formspreeRes = await fetch('https://formspree.io/f/xnjypppy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name, email, subject, message }),
  })

  if (!formspreeRes.ok) {
    return res.status(500).json({ error: 'Failed to send message' })
  }

  return res.status(200).json({ ok: true })
}
