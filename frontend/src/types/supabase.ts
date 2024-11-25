export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            password: string;
            created_at: string;
          };
          Insert: {
            email: string;
            password: string;
          };
        };
        url_analyses: {
          Row: {
            id: string;
            user_id: string;
            url: string;
            threat_level: string;
            details: any;
            analyzed_at: string;
          };
          Insert: {
            user_id: string;
            url: string;
            threat_level: string;
            details: any;
          };
        };
      };
    };
  };