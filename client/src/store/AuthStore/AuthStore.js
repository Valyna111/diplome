import { makeObservable, observable, action } from 'mobx';
import { loginUser, fetchProfile, logoutUser } from '@/lib/auth'; // Импортируйте функции

export default class AuthStore {
  currentUser = null;
  isLoading = true;
  isModalLogin = false;
  isModalRegister = false

  // Состояния для формы входа
  loginForm = {
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
      general: '',
    },
  };

  // Состояния для формы регистрации
  registerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    repeatPassword: '',
    errors: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
      general: '',
    },
  };


  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      currentUser: observable,
      loginForm: observable,
      registerForm: observable,
      isLoading: observable,
      isModalLogin: observable,
      isModalRegister: observable,
      setIsModalRegister: action,
      setIsModalLogin: action,
      setCurrentUser: action,
      resetFormStates: action,
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
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }
  
      alert('Регистрация прошла успешно!');
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async login(credentials) {
    this.isLoading = true;
    try {
      const response = await loginUser(credentials);
      if (response.error) {
        // Если есть ошибка, передаем её в компонент
        throw new Error(response.error);
      }
      await this.fetchUserProfile();
    } catch (error) {
      // Передаем ошибку в компонент
      throw error;
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
  
  setIsModalLogin(flag) {
    this.isModalLogin = flag;
  }
  setIsModalRegister(flag) {
    this.isModalRegister = flag;
  }

  resetFormStates() {
    this.loginForm = {
      email: '',
      password: '',
      errors: {
        email: '',
        password: '',
        general: '',
      },
    };

    this.registerForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        repeatPassword: '',
        general: '',
      },
    };
  }
}