'use client';

import { useEffect, useState } from 'react';
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
import { getEmotionData } from '@/services/emotion.service'; // Import the fake data function

// Emotion Attributes
const EMOTIONS = [
  { id: 'happiness', label: 'Happiness', color: '#facc15' },  // Yellow (Tailwind's yellow-400)
  { id: 'sadness', label: 'Sadness', color: '#7dd3fc' },      // Light blue (Tailwind's sky-300)
  { id: 'anger', label: 'Anger', color: '#ef4444' },          // Red (kept original)
  { id: 'surprise', label: 'Surprise', color: '#f97316' },    // Orange (Tailwind's orange-500)
  { id: 'fear', label: 'Fear', color: '#000000' },            // Pure black
  { id: 'disgust', label: 'Disgust', color: '#b45309' },      // Brown (Tailwind's amber-700)
  { id: 'neutral', label: 'Neutral', color: '#a1a1aa' },      // Grey (Tailwind's gray-400)
] as const;

export function EmotionGraph() {
  const [data, setData] = useState<any[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['neutral']);

  // Fetch Data from fake data function
  useEffect(() => {
    async function fetchEmotionData() {
      const emotions = await getEmotionData();
      if (Array.isArray(emotions)) {
        setData(emotions); // Handle case where emotions is an array
      } else {
        setData(emotions.chartData || []); // Handle case where emotions is an object
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
      {/* Card Header */}
      <div className="border-b bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <h3 className="text-xl font-semibold text-white">Emotion Trends</h3>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Emotion Selection Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {EMOTIONS.map((emotion) => (
            <div
              key={emotion.id}
              className="flex items-center gap-2 rounded-lg bg-white/50 p-2 dark:bg-gray-700/50"
            >
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