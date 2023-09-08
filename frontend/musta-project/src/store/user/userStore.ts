import { makeAutoObservable } from 'mobx';
import userRepository from '../../reppository/userRepository';
import { ChangeEvent } from 'react';
import _ from 'lodash';
import { AxiosResponse, ResponseType } from 'axios';
import { useNavigate, useNavigation, useRoutes } from 'react-router-dom';
import authStore from './authStore';
import useStores from '../useStores';
import { Cookies } from 'react-cookie';
import { removeRefershToken } from '../../uitls/cookies';

interface userInfo {
  username: string;
  accessToken: string;
}

type loginform = {
  username: string;
  password: string;
};

type signupform = {
  username: string;
  password: string;
  checkPassword: string;
  email: string;
  phoneNumber: string;
  address?: { zipcode: string; city: string; street?: string };
};

export default class userStore {
  constructor() {
    makeAutoObservable(this);
  }
  userInfo: userInfo = {
    username: '',
    accessToken: '',
  };

  userAddress = { zipcode: '', city: '', street: '' };

  userRepository = userRepository;
  getUserInfo = async () => {
    this.userInfo;
  };

  login = async (data: FormData) => {
    const username: string | undefined = data.get('id')?.toString();
    const password: string | undefined = data.get('password')?.toString();
    if (username == undefined || password == undefined) {
      return;
    }
    const loginform: loginform = {
      username: username,
      password: password,
    };

    return await userRepository
      .login(loginform)
      .then((res: any) => {
        if (200 <= res.status && res.status < 400) {
          console.log(res.data.accessToken);
          localStorage.setItem('accessToken', res.data.accessToken);
          this.userInfo = {
            ...this.userInfo,
            username: res.data.username,
            accessToken: res.data.accessToken,
          };
        }
      })
      .catch((err: any) => {
        Promise.reject(err);
      });
  };

  handleSignup = async (data: FormData) => {
    const signupform: signupform = {
      username: (data.get('id') as string).toLowerCase(),
      password: data.get('password') as string,
      checkPassword: data.get('check_password') as string,
      email: data.get('email') as string,
      phoneNumber: data.get('phoneNumber') as string,
    };

    if (
      this.userAddress.city != undefined &&
      this.userAddress.zipcode != undefined
    ) {
      signupform.address = {
        city: this.userAddress.city,
        zipcode: this.userAddress.zipcode,
        street: this.userAddress.street,
      };
    }

    const res = await userRepository
      .signup(signupform)
      .then((res: AxiosResponse) => {})
      .catch((res: AxiosResponse) => {});
  };

  setAddress = ({ zipcode, city }: { zipcode: string; city: string }) => {
    this.userAddress = {
      ...this.userAddress,
      zipcode: zipcode,
      city: city,
    };
  };

  setStreet = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.userAddress.street =
      this.userAddress.street != null ? e.target.value : '';
  };

  isDisabled = () => {
    return !(
      this.userAddress.zipcode.length > 0 && this.userAddress.city.length > 0
    );
  };
}
