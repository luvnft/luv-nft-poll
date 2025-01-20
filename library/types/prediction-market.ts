export interface PredictionMarket {
  address: string;
  question: string;
  avatar: string;
  description: string;
  end_timestamp: number;
  yes_token: string;
  no_token: string;
  total_staked: string;
  is_resolved: boolean;
  winning_position?: boolean;
  denom: string;
  recent_activity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  user: string;
  action: "staked" | "withdraw" | "resolve";
  choice?: "yes" | "no";
  amount?: string;
  price?: number;
  timestamp: number;
  avatar: string;
  question: string;
}

export interface UserStake {
  pollAddress: string;
  stakes: {
    amount: string;
    position: boolean;
    withdrawn: boolean;
  }[];
}

export interface EpochInfo {
  start_time: number;
  end_time: number;
  total_distribution: string;
  is_distributed: boolean;
  num_stakers: number;
}