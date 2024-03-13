interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  cover: string;
  avatar: string;
  username: string;
  phone: string;
  gender: string;
  birthday: Date;
  oauth: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
