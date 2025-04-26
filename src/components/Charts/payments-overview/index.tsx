'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Supabase Configuration
const supabaseUrl = "https://cptobjklpadqfwzchnxg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdG9iamtscGFkcWZ3emNobnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODQyNjEsImV4cCI6MjA2MTE2MDI2MX0.yoih_KbEBd_HajuIqQ65MO6TuK7fFA1ya0-MOX5RIn8";
const supabase = createClient(supabaseUrl, supabaseKey);

// Emotion Attributes from e_score Table
const EMOTIONS = [
  { id: 'happy', label: 'Happy', color: '#22c55e' },
  { id: 'sad', label: 'Sad', color: '#3b82f6' },
  { id: 'angry', label: 'Anger', color: '#ef4444' },
  { id: 'surprise', label: 'Surprise', color: '#eab308' },
  { id: 'fear', label: 'Fear', color: '#8b5cf6' },
  { id: 'disgust', label: 'Disgust', color: '#8b0000' },
  { id: 'neutral', label: 'Neutral', color: '#64748b' },
] as const;

export function EmotionGraph() {
  const [data, setData] = useState<any[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['neutral']);

  // Fetch Data from Supabase
  useEffect(() => {
    async function fetchEmotionData() {
      const { data: emotions, error } = await supabase
        .from('e_score')
        .select('captured_at, happy, sad, angry, surprise, fear, disgust, neutral')
        .order('captured_at', { ascending: true });

      if (error) {
        console.error("Error fetching emotions:", error.message);
      } else {
        // Format Data for Recharts
        const formattedData = emotions.map((entry: any) => ({
          timestamp: new Date(entry.captured_at).toISOString(),
          happy: entry.happy,
          sad: entry.sad,
          anger: entry.angry,
          surprise: entry.surprise,
          fear: entry.fear,
          disgust: entry.disgust,
          neutral: entry.neutral,
        }));
        setData(formattedData);
      }
    }

    fetchEmotionData();
    const intervalId = setInterval(fetchEmotionData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Toggle Emotion Selection
  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionId)
        ? prev.filter((id) => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  return (
    <div className="col-span-12 xl:col-span-7 overflow-hidden rounded-lg border bg-white/50 backdrop-blur-lg shadow-sm dark:bg-gray-800/50">
      {/* Card Header - replacing CardHeader */}
      <div className="border-b bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <h3 className="text-xl font-semibold text-white">Emotion Trends</h3>
      </div>
      
      {/* Card Content - replacing CardContent */}
      <div className="p-6">
        {/* Emotion Selection Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {EMOTIONS.map((emotion) => (
            <div
              key={emotion.id}
              className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-gray-700/50"
            >
              {/* Custom checkbox implementation */}
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={emotion.id}
                  checked={selectedEmotions.includes(emotion.id)}
                  onChange={() => toggleEmotion(emotion.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <label
                htmlFor={emotion.id}
                className="text-sm font-medium leading-none"
              >
                {emotion.label}
              </label>
            </div>
          ))}
        </div>

        {/* Emotion Graph */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                {EMOTIONS.map((emotion) => (
                  <linearGradient
                    key={emotion.id}
                    id={`gradient-${emotion.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={emotion.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={emotion.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" opacity={0.2} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Legend />
              {EMOTIONS.map(
                (emotion) =>
                  selectedEmotions.includes(emotion.id) && (
                    <Area
                      key={emotion.id}
                      type="monotone"
                      dataKey={emotion.id}
                      name={emotion.label}
                      stroke={emotion.color}
                      fill={`url(#gradient-${emotion.id})`}
                      strokeWidth={2}
                    />
                  )
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}