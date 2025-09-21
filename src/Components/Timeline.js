import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Bot,
  Activity
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const Timeline = ({ auth, user }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bot history from the correct API endpoint
  const fetchBotHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.user_id) {
        throw new Error('User not authenticated');
      }

      // Get Firebase ID token
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      // Use the correct endpoint from your backend
      const response = await fetch(`${API_BASE_URL}/api/bots/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to fetch bot history');
      }

      // Transform the history data to timeline events format
      const events = transformHistoryToEvents(responseData.history || []);
      
      // Sort by timestamp (newest first)
      events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setTimelineEvents(events);
    } catch (err) {
      console.error('Error fetching bot history:', err);
      setError(`Failed to load bot history: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Transform history data from backend to timeline events format
  const transformHistoryToEvents = (historyData) => {
    const events = [];
    
    historyData.forEach((botData) => {
      if (botData && typeof botData === 'object') {
        const event = {
          id: botData.id || `bot_${Date.now()}_${Math.random()}`,
          type: getEventTypeFromBot(botData),
          title: botData.name || `${botData.type || 'Unknown'} Bot`,
          description: botData.description || `Bot execution ${botData.status || 'completed'}`,
          user: botData.assignee || user.displayName || user.email || 'System',
          timestamp: formatTimestamp(botData.completed_at || botData.moved_to_history_at || botData.lastActivity),
          duration: calculateDuration(botData.start_time, botData.completed_at),
          priority: botData.priority || 'medium',
          botType: botData.type || 'General Bot',
          status: botData.status || 'completed',
          runCount: botData.runCount || 1,
          successRate: botData.successRate || 100,
          config: botData.config,
          botId: botData.id,
          progress: botData.progress || 100,
          rawData: botData
        };
        events.push(event);
      }
    });
    
    return events;
  };

  // Helper function to determine event type from bot data
  const getEventTypeFromBot = (botData) => {
    const status = botData.status?.toLowerCase();
    const successRate = botData.successRate || 100;
    const progress = botData.progress || 100;
    
    if (status === 'error' || status === 'failed' || successRate < 50) return 'delayed';
    if (status === 'running' || status === 'in_progress' || (progress > 0 && progress < 100)) return 'started';
    if (status === 'completed' || status === 'success' || progress === 100) return 'completed';
    return 'completed'; // Default
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toLocaleString();
    
    try {
      // Handle Firebase timestamp format
      if (timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleString();
      }
      
      // Handle ISO string or regular timestamp
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return timestamp.toString();
      }
      
      return date.toLocaleString();
    } catch {
      return timestamp?.toString() || 'Unknown';
    }
  };

  // Helper function to calculate duration
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'Unknown';
    
    try {
      let start, end;
      
      // Handle Firebase timestamp format
      if (startTime._seconds) {
        start = new Date(startTime._seconds * 1000);
      } else {
        start = new Date(startTime);
      }
      
      if (endTime._seconds) {
        end = new Date(endTime._seconds * 1000);
      } else {
        end = new Date(endTime);
      }
      
      const diffMs = end - start;
      
      if (diffMs < 0 || isNaN(diffMs)) return 'Unknown';
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    } catch {
      return 'Unknown';
    }
  };

  // Load data on component mount and when user changes
  useEffect(() => {
    if (user && auth && auth.currentUser) {
      fetchBotHistory();
    }
  }, [user, auth]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'started':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bot className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'completed':
        return 'bg-green-100 border-green-500';
      case 'started':
        return 'bg-blue-100 border-blue-500';
      case 'delayed':
        return 'bg-yellow-100 border-yellow-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBotTypeColor = (botType) => {
    const type = botType?.toLowerCase() || '';
    if (type.includes('media')) return 'text-purple-600 bg-purple-100';
    if (type.includes('communication')) return 'text-blue-600 bg-blue-100';
    if (type.includes('ecommerce') || type.includes('flipkart')) return 'text-orange-600 bg-orange-100';
    if (type.includes('scraper') || type.includes('data')) return 'text-teal-600 bg-teal-100';
    return 'text-gray-600 bg-gray-100';
  };

  const filteredEvents = timelineEvents.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.botType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.botId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Show loading if not authenticated
  if (!user || !auth || !auth.currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
          <span className="ml-3 text-lg text-gray-600">Please authenticate to view bot history</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading bot history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchBotHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bot History Timeline</h2>
            <p className="text-sm text-gray-600">User: {user.name || user.email}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Bots</option>
              <option value="completed">Completed</option>
              <option value="started">Running</option>
              <option value="delayed">Had Issues</option>
            </select>
          </div>
          
          <button
            onClick={fetchBotHistory}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {timelineEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No bot history found</p>
          <p className="text-sm">Bot execution history will appear here once bots complete their tasks.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {timelineEvents.length} bot executions
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-12 h-12 rounded-full border-4 ${getEventColor(event.type)} flex items-center justify-center bg-white`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Event content */}
                  <div className="ml-6 flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                        <p className="text-xs text-gray-500">ID: {event.botId}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBotTypeColor(event.botType)}`}>
                          {event.botType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{event.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {event.duration}</span>
                      </div>
                    </div>
                    
                    {/* Bot stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-600 font-medium">
                        Runs: {event.runCount}
                      </span>
                      <span className={`font-medium ${event.successRate >= 90 ? 'text-green-600' : event.successRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        Success Rate: {event.successRate}%
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'completed' ? 'text-green-700 bg-green-100' :
                        event.status === 'error' ? 'text-red-700 bg-red-100' :
                        'text-blue-700 bg-blue-100'
                      }`}>
                        {event.status}
                      </span>
                      {event.progress !== undefined && (
                        <span className="text-gray-600 font-medium">
                          Progress_Made : {event.progress}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {filteredEvents.length === 0 && timelineEvents.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No bots found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timeline;