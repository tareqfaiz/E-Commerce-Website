import React, { useState } from 'react';
import ContactForm from './ContactForm';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you today? You can ask me about orders, products, or anything else.' }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShowContactForm(false);
    }
  };

  const handleUserInput = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Track if last response was fallback
    let fallbackCount = 0;

    // Get current date and time info for greeting
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const hour = now.getHours();
    let timeOfDay = 'morning';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 14) timeOfDay = 'noon';
    else if (hour >= 14 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Simple rule-based responses with greetings and date/time info
    const lowerInput = input.toLowerCase();
    let botResponse = "I'm sorry, I didn't understand that. You can ask about orders, products, or type 'contact' to reach a human.";

    // Greetings detection
    const greetings = ['hi', 'hello', 'hey', 'how are you', 'good morning', 'good afternoon', 'good evening', 'good night'];
    if (greetings.some(greet => lowerInput.includes(greet))) {
      botResponse = `Hello! Good ${timeOfDay}, this is a great time for shopping! Today is ${dayName} ${date} ${monthName} ${year}. How can I help you?`;
    } else if (lowerInput.includes('order')) {
      botResponse = 'You can view your order history in your profile page.';
    } else if (lowerInput.includes('product')) {
      botResponse = 'You can browse products on the products page.';
    } else if (lowerInput.includes('price')) {
      botResponse = 'Please visit the products page to see prices for all products.';
    } else if (lowerInput.includes('category') || lowerInput.includes('menu')) {
      botResponse = 'You can browse product categories on the products page.';
    } else if (lowerInput.includes('address') || lowerInput.includes('location')) {
      botResponse = 'Our address is 123 Online Store St., Cityville, ST 12345, Country.';
    } else if (lowerInput.includes('email') || lowerInput.includes('contact email')) {
      botResponse = 'You can contact us at support@onlinestore.com.';
    } else if (lowerInput.includes('phone') || lowerInput.includes('contact phone')) {
      botResponse = 'Our phone number is +1 (555) 123-4567.';
    } else if (lowerInput.includes('contact') || lowerInput.includes('human')) {
      botResponse = 'Sure, I will open the contact form for you.';
      setShowContactForm(true);
    }

    // Check last two bot messages for fallback to suggest contact form
    const lastTwoBotMessages = messages.filter(m => m.from === 'bot').slice(-2);
    const fallbackMessage = "I'm sorry, I didn't understand that. You can ask about orders, products, or type 'contact' to reach a human.";
    if (lastTwoBotMessages.length === 2 && lastTwoBotMessages.every(m => m.text === fallbackMessage)) {
      botResponse = "It seems I am having trouble understanding. Would you like to contact a human? I can open the contact form for you.";
      setShowContactForm(true);
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: botResponse }]);
    }, 500);

    setInput('');
  };

  return (
    <div className="chatbot-container" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '50px',
      height: '50px',
      maxWidth: '90vw',
      zIndex: 10000,
      pointerEvents: 'auto',
      marginRight: 'env(safe-area-inset-right)',
    }}>
      <button onClick={toggleChat} style={{
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        fontSize: '24px',
      }}>
        {isOpen ? '×' : '💬'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          marginTop: '10px',
          height: '400px',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
        }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                textAlign: msg.from === 'bot' ? 'left' : 'right',
                margin: '5px 0',
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  backgroundColor: msg.from === 'bot' ? '#f1f0f0' : '#007bff',
                  color: msg.from === 'bot' ? 'black' : 'white',
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          {!showContactForm && (
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                value={input}
                onChange={handleUserInput}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Type your message..."
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button onClick={handleSend} style={{
                marginLeft: '5px',
                padding: '8px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>Send</button>
            </div>
          )}
          {showContactForm && (
            <ContactForm onClose={() => setShowContactForm(false)} />
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
