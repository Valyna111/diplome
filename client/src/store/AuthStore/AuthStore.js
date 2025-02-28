import { makeObservable, observable, action } from 'mobx';
import { loginUser, fetchProfile, logoutUser, registerUser } from '@/lib/auth'; // Импортируйте функции

export default class AuthStore {
  currentUser = null;
  isLoading = true;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      currentUser: observable,
      isLoading: observable,
      setCurrentUser: action,
      login: action,
      logout: action,
      fetchUserProfile: action,
      registerUser: action
    });

    this.fetchUserProfile();
  }

  async registerUser(userData) {
    this.isLoading = true;
    try {
      await registerUser(userData); // Используем функцию registerUser
      alert('Регистрация прошла успешно!');
    } catch (error) {
      alert(`Ошибка регистрации: ${error.message}`);
    } finally {
      this.isLoading = false;
    }
  }

  async login(credentials) {
    this.isLoading = true;
    try {
      await loginUser(credentials);
      await this.fetchUserProfile();
    } finally {
      this.isLoading = false;
    }
  }

  async fetchUserProfile() {
    this.isLoading = true;
    try {
      const response = await fetchProfile();
      this.setCurrentUser(response.user);
    } catch (error) {
      this.currentUser = null;
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    this.isLoading = true;
    try {
      await logoutUser();
      this.currentUser = null;
    } finally {
      this.isLoading = false;
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }
}