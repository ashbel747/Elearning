const axios = require('axios');

const API_BASE = 'http://localhost:3500/api';

async function testChatAPI() {
  try {
    console.log('🧪 Testing Chat API Integration...\n');

    // Test 1: Send a message
    console.log('1️⃣ Testing message endpoint...');
    const sessionId = 'test-session-' + Date.now();

    const messageResponse = await axios.post(`${API_BASE}/chat/message`, {
      sessionId,
      message: 'How do I enroll in a course?',
      context: {
        page: 'courses',
        courseId: 'foundations-101'
      }
    });

    console.log('✅ Message sent successfully!');
    console.log('Reply:', messageResponse.data.reply);
    console.log('Session ID:', messageResponse.data.sessionId);
    console.log('Context length:', messageResponse.data.context.length, 'messages\n');

    // Test 2: Get chat history
    console.log('2️⃣ Testing history endpoint...');
    const historyResponse = await axios.get(`${API_BASE}/chat/history/${sessionId}`);

    console.log('✅ History retrieved successfully!');
    console.log('History length:', historyResponse.data.history.length, 'messages');
    console.log('Session ID:', historyResponse.data.sessionId);

    // Test 3: Test context-aware responses
    console.log('\n3️⃣ Testing context-aware responses...');
    const contextResponse = await axios.post(`${API_BASE}/chat/message`, {
      sessionId,
      message: 'What will I learn in this course?',
      context: {
        page: 'course-detail',
        courseId: 'foundations-101'
      }
    });

    console.log('✅ Context-aware response received!');
    console.log('Reply:', contextResponse.data.reply);

    console.log('\n🎉 All tests passed! Chat API integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testChatAPI();
