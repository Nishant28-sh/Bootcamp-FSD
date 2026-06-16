function Contact() {
  return (
    <div className="page">
      <h1>Contact Us</h1>

      <form className="contact-form">
        <input
          type="text"
          placeholder="Enter your name"
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          required
        />

        <textarea
          rows="5"
          placeholder="Enter your message"
          required
        ></textarea>

        <button type="submit">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;