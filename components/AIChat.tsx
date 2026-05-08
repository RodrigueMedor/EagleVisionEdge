'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Welcome to IGR Auto Sales! I'm here to help you find your perfect vehicle. Ask me about our inventory, financing, or schedule a test drive!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPredefinedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Vehicle inventory responses
    if (lowerMessage.includes('inventory') || lowerMessage.includes('vehicles') || lowerMessage.includes('cars') || lowerMessage.includes('what do you have')) {
      return "We have a great selection of vehicles including sedans, SUVs, and trucks from top brands like Toyota, Honda, Ford, and Chevrolet. Our inventory changes daily, so what type of vehicle are you interested in?";
    }
    
    // Specific brand inquiries
    if (lowerMessage.includes('toyota') || lowerMessage.includes('camry') || lowerMessage.includes('corolla')) {
      return "Yes! We currently have several Toyota models available including the Camry SE and Corolla. Both are known for reliability and great fuel economy. Would you like more details about pricing or features?";
    }
    
    if (lowerMessage.includes('honda') || lowerMessage.includes('civic') || lowerMessage.includes('accord')) {
      return "Honda is one of our most popular brands! We have Civic and Accord models in stock. They're perfect for daily commuting with excellent safety ratings. What's your budget range?";
    }
    
    if (lowerMessage.includes('ford') || lowerMessage.includes('f-150') || lowerMessage.includes('truck')) {
      return "We have Ford trucks including the F-150 XLT with 4x4 and towing packages. Perfect for work or recreation! Are you looking for a specific configuration?";
    }
    
    if (lowerMessage.includes('suv') || lowerMessage.includes('equinox') || lowerMessage.includes('rogue') || lowerMessage.includes('sorento')) {
      return "Our SUV selection includes Chevrolet Equinox, Nissan Rogue, and Kia Sorento. Great for families with plenty of cargo space and modern safety features. How many passengers do you typically carry?";
    }
    
    // Price and budget questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('afford')) {
      return "Our vehicles range from $14,995 to $31,995. We also offer financing options with monthly payments starting around $279. What's your preferred price range?";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('monthly')) {
      return "Monthly payments depend on the vehicle and financing terms. For example, a $20,000 vehicle could be around $359/month with good credit. Would you like to get pre-approved for financing?";
    }
    
    // Financing questions
    if (lowerMessage.includes('financing') || lowerMessage.includes('loan') || lowerMessage.includes('credit') || lowerMessage.includes('approved')) {
      return "We offer competitive financing with rates starting at 3.9% APR. Our finance team can get you pre-approved in minutes, even with less-than-perfect credit. What's your credit situation like?";
    }
    
    // Test drive and visit questions
    if (lowerMessage.includes('test drive') || lowerMessage.includes('try') || lowerMessage.includes('see the car')) {
      return "I'd love to schedule a test drive for you! We're open Monday-Friday 9AM-7PM and Saturday 10AM-5PM. What vehicle are you interested in and what day works best?";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where are you')) {
      return "We're conveniently located at 123 Main Street, Miami, FL 33101. Right off I-95 with plenty of parking! Would you like directions or should I schedule your visit?";
    }
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
      return "We're open Monday-Friday 9AM-7PM and Saturday 10AM-5PM. Closed Sundays. When would you like to stop by?";
    }
    
    // Contact information
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
      return "You can reach us at (305) 555-0123 or visit us in person. Our sales team is ready to help you find the perfect vehicle! What's the best way to contact you?";
    }
    
    // Trade-in questions
    if (lowerMessage.includes('trade') || lowerMessage.includes('sell my car') || lowerMessage.includes('trade-in')) {
      return "Yes, we accept trade-ins! We'll give you a fair market value for your current vehicle. Just bring it by for a quick appraisal. What are you currently driving?";
    }
    
    // Warranty and service
    if (lowerMessage.includes('warranty') || lowerMessage.includes('service') || lowerMessage.includes('maintenance')) {
      return "All our vehicles come with a 30-day warranty and have been thoroughly inspected. We also offer extended warranty options. Our service department is here for all your maintenance needs!";
    }
    
    // Help and assistance
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('how do you work')) {
      return "I can help you find vehicles, check pricing, discuss financing options, schedule test drives, and answer questions about our dealership. What would you like to know?";
    }
    
    // Default responses
    const defaultResponses = [
      "Great question! Let me help you find the perfect vehicle. What type are you interested in - sedan, SUV, or truck?",
      "I'm here to help! You can ask me about our inventory, pricing, financing, or schedule a test drive.",
      "Thanks for reaching out! What's most important to you in your next vehicle - price, features, or reliability?",
      "Happy to assist! Are you looking for something specific or would you like to hear about our current specials?",
      "I can definitely help with that! What's your budget range and preferred vehicle type?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getPredefinedResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">IGR Auto Assistant</h3>
              <p className="text-sm opacity-90">Always here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our inventory..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
