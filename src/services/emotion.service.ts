// services/emotion.service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cptobjklpadqfwzchnxg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdG9iamtscGFkcWZ3emNobnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODQyNjEsImV4cCI6MjA2MTE2MDI2MX0.yoih_KbEBd_HajuIqQ65MO6TuK7fFA1ya0-MOX5RIn8";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEmotionData(timeFrame = "monthly") {
  // Define the time range
  const now = new Date();
  let startDate = new Date();
  
  switch(timeFrame) {
    case "weekly":
      startDate.setDate(now.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "yearly":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('e_score')
      .select('*')
      .gte('captured_at', startDate.toISOString())
      .order('captured_at', { ascending: true });
    
    if (error) throw error;
    if (!data || data.length === 0) return { chartData: [], scores: null };

    // Calculate scores
    let totalScore = 0;
    let emotionScore = 0;
    let attentionScore = 0;
    let dataCount = 0;

    data.forEach(entry => {
      // Extract emotion values (assuming these fields exist in your Supabase table)
      const happiness = entry.happy || 0;
      const sadness = entry.sad || 0;
      const anger = entry.angry || 0;
      const surprise = entry.surprise || 0;
      const fear = entry.fear || 0;
      const disgust = entry.disgust || 0;
      const neutral = entry.neutral || 0;

      // Calculate daily scores
      const dailyPositive = happiness + (surprise * 0.5);
      const dailyNegative = sadness + anger + fear + disgust;
      
      totalScore += dailyPositive - (dailyNegative * 0.5);
      emotionScore += dailyPositive;
      attentionScore += 1 - neutral;
      dataCount++;
    });

    // Normalize scores to 0-100 scale
    const normalize = (value: number) => Math.min(100, Math.max(0, Math.round((value / dataCount) * 100)));

    const scores = {
      totalScore: normalize(totalScore),
      emotionScore: normalize(emotionScore),
      attentionScore: normalize(attentionScore)
    };

    return {
      chartData: data,
      scores: scores
    };

  } catch (error) {
    console.error("Failed to fetch emotion data:", error);
    return {
      chartData: [],
      scores: null
    };
  }
}