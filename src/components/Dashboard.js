import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentAnalyses();
  }, []);

  const loadRecentAnalyses = async () => {
    try {
      const response = await apiService.getRecentAnalyses();
      if (response.success) {
        setRecentAnalyses(response.data);
      }
    } catch (error) {
      console.error('Error loading recent analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Analyses</h2>
      
      {recentAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
          <p className="text-gray-500">Start by analyzing your first website!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentAnalyses.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline font-medium">
                    {item.url}
                  </a>
                  <div className="text-sm text-gray-500 mt-1">
                    Analyzed on {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Overall Score</div>
                  <div className="text-lg font-bold text-blue-600">
                    {item.overall_score || 'N/A'}/10
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;