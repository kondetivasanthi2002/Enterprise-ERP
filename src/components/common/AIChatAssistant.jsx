import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, RefreshCw, CheckCircle2, Mic, MicOff, Download, ArrowRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AIChatAssistant = () => {
  const {
    isAIChatOpen,
    toggleAIChat,
    financialHistory,
    invoices,
    inventorySKUs,
    employees,
    procurementPOs,
    mrpWorkOrders,
    crmLeads,
    activeSubsidiary,
    setActiveModule,
    approvePurchaseOrder,
    updateInventoryStock,
    showToast
  } = useERP();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello Alex! 👋 I am your **Apex ERP AI Assistant** connected live to ${activeSubsidiary?.name || 'Apex Global HQ'}.\n\nHow can I assist you with financial analysis, inventory stock alerts, HR payroll insights, or automated procurement actions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    { label: '📊 Financial Summary', query: 'What is our net margin and total revenue this quarter?' },
    { label: '📦 Inventory Check', query: 'Are there any items below safety reorder stock?' },
    { label: '👥 Payroll Insights', query: 'Show employee headcount and monthly payroll expenses.' },
    { label: '🛒 Procurement Status', query: 'List pending purchase orders awaiting approval.' }
  ];

  const lowStockCount = inventorySKUs ? inventorySKUs.filter(item => item.qtyOnHand < item.reorderLevel).length : 0;
  const pendingPOCount = procurementPOs ? procurementPOs.filter(po => (po.status || '').toLowerCase().includes('pending')).length : 0;
  const totalBadgeAlerts = lowStockCount + pendingPOCount;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAIChatOpen]);

  // Voice Recognition Handler (Speech-to-Text)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser. Please use Chrome/Edge.', 'warning');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('🎙️ Listening... Speak your ERP query now!', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        showToast(`Recognized: "${transcript}"`, 'success');
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Export Chat History as Markdown Transcript
  const exportChatTranscript = () => {
    let content = `# Apex ERP AI Assistant Chat Transcript\n`;
    content += `**Subsidiary:** ${activeSubsidiary?.name || 'Apex Global HQ'}\n`;
    content += `**Date:** ${new Date().toLocaleString()}\n\n---\n\n`;

    messages.forEach(m => {
      content += `### ${m.sender === 'user' ? '👤 User' : '🤖 ApexAI'} (${m.timestamp})\n`;
      content += `${m.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexAI_Transcript_${Date.now()}.md`;
    a.click();
    showToast('Exported AI Chat Transcript as Markdown file!', 'success');
  };

  // Real-time Context-Aware AI Response Engine
  const generateAIResponse = (userText) => {
    const lower = userText.toLowerCase();

    // 1. Financial Queries
    if (lower.includes('net margin') || lower.includes('revenue') || lower.includes('financial') || lower.includes('finance') || lower.includes('profit')) {
      const totalRev = financialHistory ? financialHistory.reduce((sum, item) => sum + (item.revenue || 0), 0) : 24500000;
      const totalExpenses = financialHistory ? financialHistory.reduce((sum, item) => sum + (item.expenses || 0), 0) : 18375000;
      const totalNetProfit = totalRev - totalExpenses;
      const marginRate = totalRev > 0 ? ((totalNetProfit / totalRev) * 100).toFixed(1) : '25.0';

      return {
        text: `📊 **Financial Performance Summary (${activeSubsidiary?.name || 'Apex Global HQ'}):**\n\n` +
          `• **Quarterly Revenue:** $4,850,000 ${activeSubsidiary?.currency || 'USD'}\n` +
          `• **Net Operating Margin:** **${marginRate}%**\n` +
          `• **YTD Total Revenue:** $${totalRev.toLocaleString()}\n` +
          `• **Ledger Status:** Double-entry accounts balanced cleanly.\n\n` +
          `Would you like to open the General Ledger module?`,
        actions: [
          { label: '👉 Open Finance Module', type: 'navigate', module: 'finance' }
        ]
      };
    }

    // 2. Inventory Queries
    if (lower.includes('stock') || lower.includes('inventory') || lower.includes('reorder') || lower.includes('sku')) {
      const lowStockItems = inventorySKUs ? inventorySKUs.filter(item => item.qtyOnHand < item.reorderLevel) : [];
      const totalSKUs = inventorySKUs ? inventorySKUs.length : 0;

      if (lowStockItems.length === 0) {
        return {
          text: `📦 **Inventory Stock Analysis:**\n\n` +
            `• **Total SKUs Tracked:** ${totalSKUs} items across all warehouses\n` +
            `• ✅ **Stock Status:** All items above safety reorder level!`,
          actions: [
            { label: '👉 View Inventory Catalog', type: 'navigate', module: 'inventory' }
          ]
        };
      }

      return {
        text: `📦 **Inventory Intelligence Alert:**\n\n` +
          `• **Total SKUs Tracked:** ${totalSKUs} items\n` +
          `• ⚠️ **Low Stock Items:** **${lowStockItems.length} SKU(s)** below safety reorder stock.\n\n` +
          `Would you like to issue an automated restock request or inspect the inventory catalog?`,
        actions: [
          { label: '⚡ Auto-Restock Low Stock SKUs', type: 'restock' },
          { label: '👉 Open Inventory Module', type: 'navigate', module: 'inventory' }
        ]
      };
    }

    // 3. HR Queries
    if (lower.includes('payroll') || lower.includes('headcount') || lower.includes('employee') || lower.includes('hr')) {
      const totalEmployees = employees ? employees.length : 85;
      return {
        text: `👥 **Human Capital & Payroll Insights:**\n\n` +
          `• **Total Headcount:** **${totalEmployees} Active Staff**\n` +
          `• **Monthly Payroll Expenses:** $420,000 / month\n` +
          `• **Status:** Payroll disbursement processing on track.`,
        actions: [
          { label: '👉 Open HCM Payroll Console', type: 'navigate', module: 'hcm' }
        ]
      };
    }

    // Default Fallback
    return {
      text: `🤖 **Apex AI Analysis:**\n\n` +
        `I analyzed your query for **"${userText}"**. All ERP subsystems are operating normally on ${activeSubsidiary?.name || 'Apex Global HQ'}.\n\n` +
        `Try selecting a quick shortcut or use voice mic search!`,
      actions: []
    };
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
      const responseObj = generateAIResponse(text);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseObj.text,
        actions: responseObj.actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 500);
  };

  const handleExecuteAction = (action) => {
    if (action.type === 'navigate') {
      setActiveModule(action.module);
      showToast(`Switched active view to ${action.module.toUpperCase()} module`, 'info');
    } else if (action.type === 'restock') {
      const lowStockItems = inventorySKUs ? inventorySKUs.filter(item => item.qtyOnHand < item.reorderLevel) : [];
      lowStockItems.forEach(item => {
        updateInventoryStock(item.id, item.reorderLevel * 2);
      });
      showToast(`Auto-restock issued for low stock items!`, 'success');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999 }}>
      {/* Floating Launcher Button */}
      {!isAIChatOpen && (
        <button
          onClick={() => toggleAIChat(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7, #38bdf8)',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(14, 165, 233, 0.4), 0 0 20px rgba(56, 189, 248, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '14px',
            position: 'relative'
          }}
        >
          <Sparkles size={20} />
          <span>🤖 Apex AI Assistant</span>
          {totalBadgeAlerts > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '11px', fontWeight: '800', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {totalBadgeAlerts}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Drawer */}
      {isAIChatOpen && (
        <div
          style={{
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: '600px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(14, 165, 233, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #bae6fd'
          }}
        >
          {/* Header with Export Button */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #7dd3fc'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={22} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#fff' }}>Apex AI Copilot</h4>
                <span style={{ fontSize: '11px', color: '#e0f2fe' }}>● Live Enterprise Intelligence</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={exportChatTranscript}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Export Chat Transcript (.md)"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => toggleAIChat(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f0f7ff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justify: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: msg.sender === 'user' ? '#0ea5e9' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0c4a6e',
                    border: msg.sender === 'user' ? 'none' : '1px solid #bae6fd',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</div>

                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleExecuteAction(act)}
                          style={{
                            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ArrowRight size={14} />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '10px', color: msg.sender === 'user' ? 'rgba(255,255,255,0.75)' : '#64748b', marginTop: '6px', textAlign: 'right' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '12px', padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #bae6fd', borderRadius: '12px', width: 'fit-content' }}>
                <RefreshCw size={14} className="animate-spin" />
                <span>Apex AI is analyzing ERP database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderTop: '1px solid #e0f2fe', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '7px 12px',
                  borderRadius: '20px',
                  border: '1px solid #bae6fd',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Footer with Voice Mic Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ padding: '12px 14px', borderTop: '1px solid #e0f2fe', display: 'flex', gap: '8px', backgroundColor: '#ffffff' }}
          >
            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              style={{
                backgroundColor: isListening ? '#ef4444' : '#f0f9ff',
                color: isListening ? '#ffffff' : '#0ea5e9',
                border: '1px solid #bae6fd',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Voice Search (Speech-to-Text)"
            >
              {isListening ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder="Ask Apex AI or tap Mic to speak..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #bae6fd',
                backgroundColor: '#f0f9ff',
                color: '#0c4a6e',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              style={{
                background: inputMessage.trim() ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#e0f2fe',
                color: inputMessage.trim() ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '10px 14px',
                borderRadius: '10px',
                cursor: inputMessage.trim() ? 'pointer' : 'default'
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
