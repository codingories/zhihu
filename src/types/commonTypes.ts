interface RuleProp {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean;
}

export type RulesProp = RuleProp[];

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  fitUrl?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string;
}

export type MessageType = 'success' | 'error' | 'default'

export interface ResponseType<P = {}> {
  code: number;
  meg: string;
  data: P;
}
