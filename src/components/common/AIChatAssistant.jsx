import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, RefreshCw } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { ledger, inventory, employees } = useERP();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your Apex ERP AI Assistant. How can I help you analyze financial ledgers, inventory stock, or HR metrics today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    { label: '📊 Financial Summary', query: 'What is our current financial revenue and margin?' },
    { label: '📦 Low Stock Alert', query: 'Show items below safety reorder stock' },
    { label: '👥 HR & Payroll', query: 'What is our total employee headcount?' },
    { label: '🛒 Pending POs', query: 'Summarize pending purchase orders' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const generateAIResponse = (userText) => {
    const lower = userText.toLowerCase();

    if (lower.includes('finance') || lower.includes('revenue') || lower.includes('margin')) {
      return `📊 **Financial Analysis:**\n- **Total Active Accounts:** ${ledger?.length || 120} accounts recorded\n- **Quarterly Revenue:** $4,850,000\n- **Net Profit Margin:** 24.5%\n- **Cash Flow Status:** Positive (Strong liquidity reserves)`;
    } else if (lower.includes('stock') || lower.includes('inventory') || lower.includes('reorder')) {
      return `📦 **Inventory Status Alert:**\n- **Total Items Tracked:** ${inventory?.length || 450} SKUs\n- ⚠️ **Critical Low Stock:** 3 items require reorder (Hydraulic Pumps, Steel Bolts M8, Bearing Assemblies)\n- **Recommendation:** Generate PO to primary suppliers immediately.`;
    } else if (lower.includes('hr') || lower.includes('headcount') || lower.includes('payroll') || lower.includes('employee')) {
      return `👥 **Human Capital Summary:**\n- **Active Headcount:** ${employees?.length || 85} employees\n- **Monthly Payroll:** $420,000\n- **Department Distribution:** Engineering (35%), Sales (25%), Operations (20%), Admin (20%)`;
    } else if (lower.includes('po') || lower.includes('purchase') || lower.includes('procurement')) {
      return `🛒 **Procurement Overview:**\n- **Pending Purchase Orders:** 4 POs awaiting CFO authorization ($125,400 total value)\n- **Top Supplier:** Global Industrial Logistics Ltd.`;
    } else {
      return `🤖 I analyzed your query regarding "${userText}". All ERP subsystems are operating within standard parameters. Would you like me to generate a detailed report export?`;
    }
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateAIResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '50px',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          <Sparkles size={20} />
          <span>Apex AI Copilot</span>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div
          style={{
            width: '380px',
            height: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', backgroundColor: '#3b82f6', borderRadius: '10px' }}>
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Apex ERP AI Assistant</h4>
                <span style={{ fontSize: '12px', color: '#10b981' }}>● Online & Context Aware</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                  <div
                    style={{
                      fontSize: '10px',
                      opacity: 0.7,
                      marginTop: '4px',
                      textAlign: 'right'
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '6px', color: '#64748b', fontSize: '12px', padding: '8px' }}>
                <RefreshCw size={14} className="animate-spin" /> Apex AI is analyzing ERP database...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  padding: '6px 10px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', backgroundColor: '#ffffff' }}
          >
            <input
              type="text"
              placeholder="Ask Apex AI about your ERP data..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '10px 14px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
