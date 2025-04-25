// emotion.services.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://cptobjklpadqfwzchnxg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdG9iamtscGFkcWZ3emNobnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODQyNjEsImV4cCI6MjA2MTE2MDI2MX0.yoih_KbEBd_HajuIqQ65MO6TuK7fFA1ya0-MOX5RIn8";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEmotionData(timeFrame = "monthly") {
  // Define the time range based on the timeFrame
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
      startDate.setMonth(now.getMonth() - 1); // Default to monthly
  }

  try {
    // Fetch emotion data from Supabase for the specified time period
    const { data, error } = await supabase
      .from('e_score')
      .select('*')
      .gte('captured_at', startDate.toISOString())
      .order('captured_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch emotion data from Supabase:", error);
    return [];
  }
}