export interface UserDTO {
  fullname: string;
  email: string;
  password: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface VideoDTO {
  title: string;
  video: string;
  coverImage: string;
  uploadDate: Date;
  createdBy: UserDTO;
}

export interface SignUpResponse {
  fullname: string;
  email: string;
}

export interface SignInResponse {
  fullname: string;
  email: string;
  token: string;
}
