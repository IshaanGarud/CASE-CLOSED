// CASE CLOSED — Realtime Subscription Service Layer
// Prepared for Supabase Realtime (`supabase.channel('room:<code'>)`) & WebSockets.
// Includes zero-config BroadcastChannel cross-tab live synchronization for multiplayer demos.

class RealtimeService {
  constructor() {
    this.channels = new Map();
    this.broadcastChannel = null;
    this.listeners = new Map();

    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        this.broadcastChannel = new window.BroadcastChannel('case_closed_channel');
        this.broadcastChannel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch (e) {
        console.warn("BroadcastChannel not available:", e);
      }
    }
  }

  handleBroadcastMessage(data) {
    if (!data || !data.roomCode) return;
    const roomListeners = this.listeners.get(data.roomCode);
    if (roomListeners) {
      roomListeners.forEach((callback) => {
        try {
          callback(data.room);
        } catch (err) {
          console.error("Error in realtime room listener:", err);
        }
      });
    }
  }

  /**
   * Subscribe to room events (evidence found, tasks completed, players joined, verdicts)
   * @param {string} roomCode - The 4-digit code e.g. "CC-1234"
   * @param {function} onUpdate - Callback receiving the updated room object
   * @returns {function} Unsubscribe function
   */
  subscribeToRoom(roomCode, onUpdate) {
    if (!roomCode) return () => {};

    const formattedCode = roomCode.trim().toUpperCase();

    if (!this.listeners.has(formattedCode)) {
      this.listeners.set(formattedCode, new Set());
    }
    this.listeners.get(formattedCode).add(onUpdate);

    // If Supabase environment variables are configured in future,
    // we can attach Supabase Realtime channel subscription here seamlessly:
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !this.channels.has(formattedCode)) {
      // Prepared for Masood's Supabase Realtime channel:
      // const channel = supabase.channel(`room:${formattedCode}`)
      //   .on('broadcast', { event: '*' }, (payload) => onUpdate(payload.new))
      //   .subscribe();
      // this.channels.set(formattedCode, channel);
    }

    return () => {
      const set = this.listeners.get(formattedCode);
      if (set) {
        set.delete(onUpdate);
        if (set.size === 0) {
          this.listeners.delete(formattedCode);
          // Unsubscribe Supabase channel if initialized
          if (this.channels.has(formattedCode)) {
            // this.channels.get(formattedCode).unsubscribe();
            this.channels.delete(formattedCode);
          }
        }
      }
    };
  }

  /**
   * Emit local room changes to other open tabs or listeners
   */
  broadcastUpdate(roomCode, room) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'ROOM_UPDATED',
        roomCode,
        room
      });
    }
  }
}

export const realtimeService = new RealtimeService();

