export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateCreation: Date;
}

export interface CreateUserRequest {
  nom: string;
  prenom: string;
  email: string;
}

export interface UpdateUserRequest {
  nom?: string;
  prenom?: string;
  email?: string;
}
