
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const TABLES = {
  BOOKS: 'books',
  PROFILES: 'profiles',
  BORROW_RECORDS: 'borrow_records',
  RESERVATIONS: 'reservations',
  NOTIFICATIONS: 'notifications',
  AVAILABILITY_SUBSCRIPTIONS: 'availability_subscriptions'
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
  const createMockQueryBuilder = () => {
    const builder: any = Promise.resolve({ data: null, error: null });
    
    builder.select = () => builder;
    builder.insert = () => builder;
    builder.update = () => builder;
    builder.delete = () => builder;
    builder.eq = () => builder;
    builder.is = () => builder;
    builder.single = () => builder;
    builder.order = () => builder;
    builder.limit = () => builder;
    builder.on = () => builder;
    builder.subscribe = () => ({ unsubscribe: () => {} });
    
    return builder;
  };

  clientInstance = {
    from: () => createMockQueryBuilder(),
    channel: () => createMockQueryBuilder(),
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
