import  { useState, useEffect } from 'react';
import { Clock, User, AlertCircle, CheckCircle2, Play, Pause, Trash2, Calendar, Activity, RefreshCw, Plus, UserCircle } from 'lucide-react';

const AssignedTasks = ({auth,user}) => {
  const [authToken, setAuthToken] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [systemStats, setSystemStats] = useState({
    uptime: '98%',
    totalBots: 0,
    runningBots: 0
  });
  const [newBotConfig, setNewBotConfig] = useState({
    type: 'flipkart',
    config: {}
  });

  // Flask backend URL - adjust as needed
  const API_BASE_URL = 'http://localhost:5000';

  // Initialize Firebase token
 useEffect(() => {
  const initializeAuth = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken();
        setAuthToken(token);
        // await registerUser(currentUser, token);
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      setError('Authentication failed');
    }
  };
  initializeAuth();

  // const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
  //   if (currentUser) {
  //     // User just logged in → get new token
  //     const token = await currentUser.getIdToken();
  //     setAuthToken(token);

  //     await registerUser(currentUser, token);
  //   } else {
  //     // User logged out → clear state
  //     setAuthToken(null);
  //   }
  // });

  // // 5️⃣ Cleanup → unsubscribe from onAuthStateChanged when component unmounts
  // return () => unsubscribe();
}, [auth]);

  // Register user with backend
//   const registerUser = async (currentUser, token) => {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`${API_BASE_URL}/api/users/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         user_id: currentUser.uid,
//         email: currentUser.email || '',
//         name: currentUser.displayName || 'User'
//       })
//     });

//     if (!response.ok) {
//       console.warn('User registration failed, but continuing...');
//     }
//   } catch (err) {
//     console.warn('User registration error:', err);
//   }
// };

  // Get auth headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  });

  // Fetch bot status from backend
  const fetchBots = async () => {
    setLoading(true);
    try {
      if (!authToken) {
        console.warn('No auth token available, using fallback');
      }

      // Try to get user-specific bots first
      let response = await fetch(`${API_BASE_URL}/api/users/${user?.uid || user?.user_id}/bots`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        // Fallback to general bot status endpoint
        response = await fetch(`${API_BASE_URL}/api/bots/status`, {
          headers: getAuthHeaders()
        });
      }

      if (response.ok) {
  const data = await response.json();
  const bots = data.bots || [];
  
  // Filter out completed bots that should be removed
  const activeBots = bots.filter(bot => {
    if (bot.progress >= 100 || bot.status === 'completed') {
      // Schedule removal for completed bots
      setTimeout(() => removeCompletedBot(bot.id), 1000);
      return false;
    }
    return true;
  });
  
  setBots(activeBots);
  
  // Update system stats
  const runningCount = activeBots.filter(bot => bot.status === 'running').length;
  setSystemStats(prev => ({
    ...prev,
    totalBots: activeBots.length,
    runningBots: runningCount
  }));
  
  // Monitor progress for running bots
  activeBots
    .filter(bot => bot.status === 'running')
    .forEach(bot => monitorBotProgress(bot.id));
}
 else {
        setError('Failed to fetch bot status');
        // Fallback to mock data
        setBots(getMockBots());
      }
    } catch (err) {
      setError('Unable to connect to bot service');
      setBots(getMockBots());
    } finally {
      setLoading(false);
    }
  };

  // Get system statistics
  const fetchSystemStats = async () => {
    try {
      if (!authToken) {
        console.warn('No auth token for system stats');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/system/stats`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSystemStats({
            uptime: data.stats.system_uptime || '98%',
            totalBots: data.stats.total_bots || 0,
            runningBots: data.stats.running_bots || 0
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch system stats:', err);
    }
  };

  // Mock data fallback
  const getMockBots = () => [
    {
      id: 'flipkart_1',
      name: "Flipkart Order Automation",
      type: "E-commerce Bot",
      assignee: "System",
      status: "idle",
      progress: 0,
      priority: "high",
      dueTime: "Manual Trigger",
      lastActivity: "Ready to start",
      description: "Automated product ordering from Flipkart",
      config: {
        FLIPKART_EMAIL: user?.email || "demo@example.com",
        PRODUCT_URL: "Silent Patient Book",
        UPI_ID: "demo@oksbi"
      },
      runCount: 0,
      successRate: 100
    },
    {
      id: 'youtube_1',
      name: "YouTube Playlist Sync",
      type: "Media Bot",
      assignee: "System",
      status: "idle",
      progress: 0,
      priority: "medium",
      dueTime: "Manual Trigger",
      lastActivity: "Ready to start",
      description: "Sync YouTube playlist videos to Google Drive",
      config: {
        PLAYLIST_URL: "Educational Content Playlist",
        DOWNLOAD_DIR: "/downloads/youtube"
      },
      runCount: 0,
      successRate: 100
    },
    {
      id: 'gmail_1',
      name: "Gmail Auto Response",
      type: "Communication Bot",
      assignee: "System",
      status: "idle",
      progress: 0,
      priority: "low",
      dueTime: "Continuous",
      lastActivity: "Ready to start",
      description: "Automated email responses and monitoring",
      config: {
        WATCH_EMAIL: user?.email || "demo@example.com",
        CHECK_INTERVAL_MINUTES: 1
      },
      runCount: 0,
      successRate: 100
    }
  ];

  // Start a bot
  const startBot = async (botId, botType, config) => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const endpoint = `${API_BASE_URL}/api/bots/${botType}/start`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ config })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
  // Update bot status locally
  setBots(prevBots => 
    prevBots.map(bot => 
      bot.id === botId 
        ? { 
            ...bot, 
            status: 'running', 
            progress: 0, // Reset progress when starting
            lastActivity: new Date().toLocaleString(),
            runCount: bot.runCount + 1
          }
        : bot
    )
  );
  
  // Update database
  await updateBotProgress(botId, 0, 'running', new Date().toLocaleString());
  
  // Start monitoring progress
  const progressInterval = setInterval(() => {
    monitorBotProgress(botId);
  }, 5000); // Check every 5 seconds
  
  // Store interval ID for cleanup
  setBots(prevBots => 
    prevBots.map(bot => 
      bot.id === botId 
        ? { ...bot, progressInterval }
        : bot
    )
  );
  
  setError(null);
} else {
          setError(`Failed to start bot: ${result.error}`);
        }
      } else {
        setError(`Failed to start bot: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Failed to communicate with bot service: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Pause a bot
  const pauseBot = async (botId, botType) => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const endpoint = `${API_BASE_URL}/api/bots/${botId}/pause`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      // UPDATE pauseBot function (around line 189):
// ADD this after successful pause:
if (response.ok) {
  setBots(prevBots =>
    prevBots.map(bot => {
      if (bot.id === botId) {
        // Clear progress monitoring
        if (bot.progressInterval) {
          clearInterval(bot.progressInterval);
        }
        return { 
          ...bot, 
          status: 'paused', 
          lastActivity: `Paused at ${new Date().toLocaleString()}`,
          progressInterval: null
        };
      }
      return bot;
    })
  );
  
  // Update database
  await updateBotProgress(botId, null, 'paused', `Paused at ${new Date().toLocaleString()}`);
  
  setError(null);
} else {
        setError('Failed to pause bot');
      }
    } catch (err) {
      setError(`Failed to pause bot: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Resume a bot
  const resumeBot = async (botId, botType) => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const endpoint = `${API_BASE_URL}/api/bots/${botId}/resume`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bot_type: botType })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBots(prevBots =>
            prevBots.map(bot =>
              bot.id === botId
                ? { ...bot, status: 'running', lastActivity: `Resumed at ${new Date().toLocaleString()}` }
                : bot
            )
          );
          setError(null);
        } else {
          setError(`Failed to resume bot: ${result.error}`);
        }
      } else {
        setError('Failed to resume bot');
      }
    } catch (err) {
      setError(`Failed to resume bot: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete a Gmail bot
  const deleteGmailBot = async (botId) => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const endpoint = `${API_BASE_URL}/api/bots/gmail/delete`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bot_id: botId })
      });

      if (response.ok) {
        setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
        setError(null);
      } else {
        setError('Failed to delete Gmail bot');
      }
    } catch (err) {
      setError(`Failed to delete Gmail bot: ${err.message}`);
      // Still remove from frontend for demo
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
    } finally {
      setLoading(false);
    }
  };
  // Delete a Gmail bot
  const deleteYoutubeBot = async (botId) => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const endpoint = `${API_BASE_URL}/api/bots/youtube/delete`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bot_id: botId })
      });

      if (response.ok) {
        setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
        setError(null);
      } else {
        setError('Failed to delete Gmail bot');
      }
    } catch (err) {
      setError(`Failed to delete Gmail bot: ${err.message}`);
      // Still remove from frontend for demo
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
    } finally {
      setLoading(false);
    }
  };
  // Delete a Gmail bot
  const deleteFlipkartBot = async (botId) => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const endpoint = `${API_BASE_URL}/api/bots/flipkart/delete`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bot_id: botId })
      });

      if (response.ok) {
        setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
        setError(null);
      } else {
        setError('Failed to delete Gmail bot');
      }
    } catch (err) {
      setError(`Failed to delete Gmail bot: ${err.message}`);
      // Still remove from frontend for demo
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
    } finally {
      setLoading(false);
    }
  };

  // Create new bot
  const createBot = async () => {
    if (!newBotConfig.type) {
      setError('Please select a bot type');
      return;
    }
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/bots/${newBotConfig.type}/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ config: newBotConfig.config })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setShowNewBotModal(false);
          setNewBotConfig({ type: 'flipkart', config: {} });
          fetchBots(); // Refresh the list
          setError(null);
        } else {
          setError(`Failed to create bot: ${result.error || 'Unknown error'}`);
        }
      } else {
        setError(`Failed to create bot: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Failed to create bot: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Sync bots from Firestore
  const syncBotsFromFirestore = async () => {
    setLoading(true);
    try {
      if (!authToken) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/bots/sync`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBots(result.bots || []);
          setError(null);
        }
      }
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setLoading(false);
    }
  };


  // Auto-refresh every 30 seconds
  // ADD THIS after line 282 (inside the useEffect):
// UPDATE the useEffect cleanup (around line 282):
useEffect(() => {
  if (authToken) {
    const fetchData = async () => {
      try {
        await fetchBots();
        await fetchSystemStats();
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000);
    
    return () => {
      clearInterval(interval);
      // Clear all progress monitoring intervals
      bots.forEach(bot => {
        if (bot.progressInterval) {
          clearInterval(bot.progressInterval);
        }
      });
    };
  }
}, [authToken, user?.user_id]);

  // Utility functions
  const getBotTypeFromName = (name) => {
    if (name.toLowerCase().includes('flipkart')) return 'flipkart';
    if (name.toLowerCase().includes('youtube')) return 'youtube';
    if (name.toLowerCase().includes('gmail')) return 'gmail';
    return 'unknown';
  };

  const isGmailBot = (name) => {
    return name.toLowerCase().includes('gmail');
  };
  const isYoutubeBot = (name) => {
    return name.toLowerCase().includes('youtube');
  };
  const isFlipkartBot = (name) => {
    return name.toLowerCase().includes('flipkart');
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'paused':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };
  const updateBotProgress = async (botId, progress, status = null, lastActivity = null) => {
  try {
    if (!authToken) return;

    const updateData = { 
      bot_id: botId, 
      progress: progress 
    };
    
    if (status) updateData.status = status;
    if (lastActivity) updateData.last_activity = lastActivity;

    const response = await fetch(`${API_BASE_URL}/api/bots/update-progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      console.warn('Failed to update bot progress in database');
    }
  } catch (err) {
    console.warn('Error updating bot progress:', err);
  }
};
// Add this function after updateBotProgress:

// Remove completed bot from database and local state
const removeCompletedBot = async (botId) => {
  try {
    if (!authToken) return;

    // Remove from database
    const response = await fetch(`${API_BASE_URL}/api/bots/remove-completed`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bot_id: botId })
    });
    if(response.ok){
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
      console.log(`Bot ${botId} completed and removed`);

    }
    
  } catch (err) {
    console.warn('Error removing completed bot:', err);
    // Still remove from frontend
    setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
  }
};
// Add this function after removeCompletedBot:

// Monitor and update bot progress
const monitorBotProgress = async (botId) => {
  try {
    if (!authToken) return;

    const response = await fetch(`${API_BASE_URL}/api/bots/${botId}/progress`, {
      headers: getAuthHeaders()
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const { progress, status, last_activity } = data;
        
        // Update local state
        setBots(prevBots => 
          prevBots.map(bot => 
            bot.id === botId 
              ? { 
                  ...bot, 
                  progress: progress,
                  status: status,
                  lastActivity: last_activity || bot.lastActivity
                }
              : bot
          )
        );

        // Update database
        await updateBotProgress(botId, progress, status, last_activity);

        // Check if completed
        if (progress >= 100 || status === 'completed') {
          setTimeout(() => removeCompletedBot(botId), 2000); // 2 second delay to show completion
        }
      }
    }
  } catch (err) {
    console.warn('Error monitoring bot progress:', err);
  }
};
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 text-green-600 animate-pulse" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-600" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case 'idle':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderBotActions = (bot) => {
    const botType = getBotTypeFromName(bot.name);
    const isGmail = isGmailBot(bot.name);
    const isYoutube = isYoutubeBot(bot.name);
    const isFlipkart = isFlipkartBot(bot.name);

    return (
      <div className="flex items-center space-x-2 ml-4">
        {bot.status === 'running' ? (
          <button 
            onClick={() => pauseBot(bot.id, botType)}
            disabled={loading}
            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
            title="Pause Bot"
          >
            <Pause className="h-4 w-4" />
          </button>
        ) : bot.status === 'paused' ? (
          <button 
            onClick={() => resumeBot(bot.id, botType)}
            disabled={loading}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Resume Bot"
          >
            <Play className="h-4 w-4" />
          </button>
        ) : (
          <button 
            onClick={() => startBot(bot.id, botType, bot.config)}
            disabled={loading}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            title="Start Bot"
          >
            <Play className="h-4 w-4" />
          </button>
        )}
        
        {/* Delete button only for Gmail bots */}
        {isGmail && (
          <button 
            onClick={() => deleteGmailBot(bot.id)}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Gmail Bot"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        
        {/* Settings button */}
        {isYoutube && (
          <button 
            onClick={() => deleteYoutubeBot(bot.id)}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Youtube Bot"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {isFlipkart && (
          <button 
            onClick={() => deleteFlipkartBot(bot.id)}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Flipkart Bot"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  const renderNewBotModal = () => {
    if (!showNewBotModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
          <h3 className="text-lg font-semibold mb-4">Create New Bot</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bot Type</label>
            <select 
              value={newBotConfig.type}
              onChange={(e) => setNewBotConfig({...newBotConfig, type: e.target.value, config: {}})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="flipkart">Flipkart Order Bot</option>
              <option value="youtube">YouTube Download Bot</option>
              <option value="gmail">Gmail Auto Reply Bot</option>
            </select>
          </div>

          {newBotConfig.type === 'flipkart' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Flipkart Email</label>
                <input 
                  type="email"
                  value={newBotConfig.config.FLIPKART_EMAIL || ''}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, FLIPKART_EMAIL: e.target.value}
                  })}
                  className="w-full p-2 border rounded"
                  placeholder={user?.email || "your.email@example.com"}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Product URL</label>
                <input 
                  type="text"
                  value={newBotConfig.config.PRODUCT_URL || ''}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, PRODUCT_URL: e.target.value}
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="Product name or URL"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">UPI ID</label>
                <input 
                  type="text"
                  value={newBotConfig.config.UPI_ID || ''}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, UPI_ID: e.target.value}
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="your-upi@bank"
                />
              </div>
            </>
          )}

          {newBotConfig.type === 'youtube' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Playlist URL</label>
                <input 
                  type="text"
                  value={newBotConfig.config.PLAYLIST_URL || ''}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, PLAYLIST_URL: e.target.value}
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="YouTube playlist URL"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Download Directory</label>
                <input 
                  type="text"
                  value={newBotConfig.config.DOWNLOAD_DIR || 'downloads'}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, DOWNLOAD_DIR: e.target.value}
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="downloads"
                />
              </div>
            </>
          )}

          {newBotConfig.type === 'gmail' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Watch Email</label>
                <input 
                  type="email"
                  value={newBotConfig.config.WATCH_EMAIL || ''}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, WATCH_EMAIL: e.target.value}
                  })}
                  className="w-full p-2 border rounded"
                  placeholder={user?.email || "email@example.com"}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Check Interval (minutes)</label>
                <input 
                  type="number"
                  value={newBotConfig.config.CHECK_INTERVAL_MINUTES || 1}
                  onChange={(e) => setNewBotConfig({
                    ...newBotConfig, 
                    config: {...newBotConfig.config, CHECK_INTERVAL_MINUTES: parseInt(e.target.value)}
                  })}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>
            </>
          )}

          <div className="flex space-x-3 mt-6">
            <button 
              onClick={createBot}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bot'}
            </button>
            <button 
              onClick={() => setShowNewBotModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show login screen if not authenticated
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
        <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">Please sign in to access your bot dashboard</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Sign In with Firebase
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Header with user info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Active Bot Tasks</h2>
          <p className="text-gray-600 mt-1">Monitor your running automation bots</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UserCircle className="h-5 w-5" />
            <span>{user.name || user.email}</span>
          </div>
          
          {/* Status badges */}
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {systemStats.runningBots} Running
          </span>
          {bots.filter(bot => bot.status === 'paused').length > 0 && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {bots.filter(bot => bot.status === 'paused').length} Paused
            </span>
          )}
          
          {/* Action buttons */}
          <button 
            onClick={syncBotsFromFirestore}
            disabled={loading}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Sync from Firestore"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setShowNewBotModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Bot</span>
          </button>
      
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        {bots.map((bot) => (
          <div key={bot.id} className={`border-l-4 rounded-lg p-5 hover:shadow-md transition-all duration-200 ${getPriorityColor(bot.priority)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">{bot.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.status)} flex items-center space-x-1`}>
                    {getStatusIcon(bot.status)}
                    <span className="capitalize">{bot.status}</span>
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    {bot.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{bot.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{bot.assignee}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{bot.dueTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{bot.lastActivity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Runs: {bot.runCount} | Success: {bot.successRate}%
                    </span>
                  </div>
                </div>
                
                {/* Progress bar for running bots */}
                {(bot.status === 'running' || bot.status === 'completed') && bot.progress >= 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{bot.progress}%</span>
                    {bot.progress >= 100 && (
                      <span className="text-green-600 font-medium">Completed!</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        bot.progress >= 100 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(bot.progress, 100)}%` }}
                    ></div>
                  </div>
                  {bot.progress >= 100 && (
                    <div className="text-xs text-green-600 mt-1">
                      Will be removed in a few seconds...
                    </div>
                  )}
                </div>
              )}

                {/* Bot configuration preview */}
                {bot.config && Object.keys(bot.config).length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {Object.entries(bot.config).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 font-medium">{key}:</span>
                          <span className="text-gray-800 truncate ml-2">
                            {typeof value === 'string' && value.length > 30
                              ? `${value.substring(0, 30)}...`
                              : String(value)
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              {renderBotActions(bot)}
            </div>
          </div>
        ))}
        
        {/* Empty state */}
        {bots.length === 0 && !loading && (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Bots</h3>
            <p className="text-gray-500 mb-6">Create your first automation bot to get started</p>
            <button 
              onClick={() => setShowNewBotModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Bot</span>
            </button>
          </div>
        )}
        
        {/* Loading state */}
        {loading && bots.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading bot tasks...</p>
          </div>
        )}
      </div>

      {/* System Stats Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">System Uptime: {systemStats.uptime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Total Bots: {systemStats.totalBots} | Active: {systemStats.runningBots}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* New Bot Modal */}
      {renderNewBotModal()}
    </div>
  );
};

export default AssignedTasks;