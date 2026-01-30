
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const TABLES = {
  BOOKS: 'books',
  PROFILES: 'profiles',
  BORROW_RECORDS: 'borrow_records',
  RESERVATIONS: 'reservations'
};

let clientInstance: any;

// Flag to check if the database is actually configured via environment
export const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (isConfigured) {
  try {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!);
    console.log("Supabase: Client initialized successfully.");
  } catch (err) {
    console.warn("Supabase: Initialization error:", err);
  }
}

if (!clientInstance) {
  const noop = () => ({
    select: () => Promise.resolve({ data: null, error: new Error("No database configured") }),
    insert: () => Promise.resolve({ data: null, error: new Error("No database configured") }),
    update: () => ({ 
      eq: () => Promise.resolve({ data: null, error: new Error("No database configured") }) 
    }),
    delete: () => ({ 
      eq: () => Promise.resolve({ data: null, error: new Error("No database configured") }) 
    }),
    eq: () => noop(),
    on: () => noop(),
    subscribe: () => ({ unsubscribe: () => {} }),
  });

  clientInstance = {
    from: () => noop(),
    channel: () => noop(),
    removeChannel: () => {},
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: ({ email }: { email: string }) => {
        return Promise.resolve({ data: { user: { email } }, error: null });
      },
      signUp: ({ email }: { email: string }) => {
        return Promise.resolve({ data: { user: { email } }, error: null });
      },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null }),
    }
  };
}

export const supabase = clientInstance;
