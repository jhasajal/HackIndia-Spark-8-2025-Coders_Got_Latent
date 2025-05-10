// utils/getOverviewData.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cptobjklpadqfwzchnxg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdG9iamtscGFkcWZ3emNobnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODQyNjEsImV4cCI6MjA2MTE2MDI2MX0.yoih_KbEBd_HajuIqQ65MO6TuK7fFA1ya0-MOX5RIn8";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getOverviewData() {
  // Get latest happy (emotion)
  const { data: emotionData } = await supabase
    .from('e_score')
    .select('happy')
    .order('created_at', { ascending: false })
    .limit(1);

  const latestHappy = emotionData?.[0]?.happy || 0;

  // Get latest focus_score (products)
  const { data: productData } = await supabase
    .from('g_score')
    .select('focus_score')
    .order('created_at', { ascending: false })
    .limit(1);

  const latestFocus = productData?.[0]?.focus_score || 0;

  // Calculate total as average of latest emotion and product scores
  const total = (latestHappy + latestFocus) / 2;

  return {
    total: {
      value: parseFloat(total.toFixed(2)),
      growthRate: 0,
    },
    emotion: {
      value: parseFloat(latestHappy.toFixed(2)),
      growthRate: 0,
    },
    products: {
      value: parseFloat(latestFocus.toFixed(2)),
      growthRate: 0,
    },
    users: {
      value: 0,
      growthRate: 0,
    },
  };
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}