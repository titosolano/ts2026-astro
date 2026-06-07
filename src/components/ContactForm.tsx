import { useState } from 'react'

const ArrowSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 7 14" fill="none" aria-hidden="true">
    <path d="M0.613281 0.61377L6.34059 6.75017L0.613281 12.8866" stroke="currentColor" strokeWidth="1.22728" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xnjypppy', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact_success">
        <div className="contact_success-label">Message sent</div>
        <p className="contact_success-copy">
          Thanks for reaching out — I'll get back to you as soon as possible.
        </p>
      </div>
    )
  }

  return (
    <form className="contact_form" onSubmit={handleSubmit} noValidate>
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <div className="contact_field-row">
        <div className="contact_field">
          <label className="contact_label" htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            className="contact_input"
            type="text"
            name="name"
            placeholder="Your name"
            required
          />
        </div>
        <div className="contact_field">
          <label className="contact_label" htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            className="contact_input"
            type="email"
            name="email"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="contact_field">
        <label className="contact_label" htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          className="contact_input"
          type="text"
          name="subject"
          placeholder="What's this about?"
          required
        />
      </div>

      <div className="contact_field">
        <label className="contact_label" htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          className="contact_input is-textarea"
          name="message"
          placeholder="Tell me about your project, idea, or question..."
          required
        />
      </div>

      {status === 'error' && (
        <p className="contact_error">Something went wrong. Please try again.</p>
      )}

      <div className="button-01_component">
        <button
          type="submit"
          className="button-01_main-wrapper"
          disabled={status === 'loading'}
        >
          <div className="button-01_text-wrapper">
            <div>{status === 'loading' ? 'Sending...' : 'Send message'}</div>
          </div>
          <div className="button-01_arrow-wrapper">
            <div className="button-01_arrow-position">
              <div className="button-01_arrow-img"><ArrowSVG /></div>
            </div>
            <div className="button-01_arrow-position">
              <div className="button-01_arrow-img"><ArrowSVG /></div>
            </div>
          </div>
          <div className="button-01_background" />
        </button>
      </div>
    </form>
  )
}
