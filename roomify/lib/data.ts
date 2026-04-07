import { supabase } from "./supabase";
import { Remote, RemoteButton } from "./types";

export async function getRemotes(): Promise<Remote[]> {
  const { data, error } = await supabase.from("remotes").select("*");
  if (error) throw error;
  return data || [];
}

export async function getButtons(remoteId: string): Promise<RemoteButton[]> {
  // Fix: Ensure we aren't passing an empty or invalid string
  if (!remoteId || remoteId === 'undefined') return [];
  
  const { data, error } = await supabase
    .from("buttons")
    .select("*")
    .eq("remote_id", remoteId);
    
  if (error) {
    console.error("Supabase Error 22P02 check:", error);
    throw error;
  }
  return data || [];
}