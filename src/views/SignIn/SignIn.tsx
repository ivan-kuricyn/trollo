import { type FC, useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';

import { useMutation } from 'react-query';

import axios, { AxiosResponse, type AxiosError } from 'axios';

import { AuthContext } from '../../context/AuthProvider';

import { Path } from '../../types';

type ErrorResponseData = { message: string; statusCode: number };

type SuccessResponseData = { token: string };

interface ISignInFrom {
  login: string;
  password: string;
}

export const SignIn: FC = () => {
  const { t } = useTranslation();

  const [passwordIsHidden, setPasswordIsHidden] = useState(true);

  const { setToken } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<ISignInFrom>();

  const navigate = useNavigate();

  const { mutate } = useMutation<
    AxiosResponse<SuccessResponseData>,
    AxiosError<ErrorResponseData>,
    ISignInFrom
  >(({ login, password }) =>
    axios.post('signin', {
      login: login,
      password: password,
    })
  );

  const onSubmit = handleSubmit((formData) => {
    const mutatePromise = new Promise((resolve, reject) => {
      mutate(formData, {
        onSuccess: ({ data: { token } }) => {
          reset();

          setToken(token);

          navigate(Path.Home);

          resolve(null);
        },
        onError: (error) => {
          reject(error.response?.data.message);
        },
      });
    });

    toast.promise(mutatePromise, {
      loading: t('toasterMessages.pending'),
      success: t('toasterMessages.success'),
      error: (error: string) => error,
    });
  });

  return (
    <main>
      <form onSubmit={onSubmit} className="max-w-md p-6 mt-[10vh] mx-auto">
        <h3 className="text-xl font-bold text-center">{t('auth.signIn')}</h3>

        <div>
          <label className="block">{t('auth.login')}</label>

          <input
            type="text"
            placeholder={t('auth.login')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            {...register('login', {
              required: {
                value: true,
                message: t('validationErrors.fieldCanNotBeEmpty'),
              },
            })}
            onChange={() => clearErrors('login')}
          />

          {errors.login && <span className="text-red-500 text-sm">{errors.login.message}</span>}
        </div>

        <div className="mt-4">
          <label className="block">{t('auth.password')}</label>

          <div className="relative">
            <input
              type={passwordIsHidden ? 'password' : 'text'}
              placeholder={t('auth.password')}
              className="w-full pl-4 pr-10 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              {...register('password', {
                required: {
                  value: true,
                  message: t('validationErrors.fieldCanNotBeEmpty'),
                },
              })}
              onChange={() => clearErrors('password')}
            />

            <div
              className="absolute right-2 top-5 cursor-pointer"
              onClick={() => setPasswordIsHidden((prev) => !prev)}
            >
              {!passwordIsHidden ? (
                <svg width="28" height="18" viewBox="10 14 44 36">
                  <path d="M32.513,13.926c10.574,0.15 19.249,9.657 23.594,17.837c0,0 -1.529,3.129 -2.963,5.132c-0.694,0.969 -1.424,1.913 -2.191,2.826c-0.547,0.65 -1.112,1.283 -1.698,1.898c-5.237,5.5 -12.758,9.603 -20.7,8.01c-8.823,-1.77 -16.02,-9.33 -20.346,-17.461c0,0 1.536,-3.132 2.978,-5.132c0.646,-0.897 1.324,-1.77 2.034,-2.617c0.544,-0.649 1.108,-1.282 1.691,-1.897c4.627,-4.876 10.564,-8.63 17.601,-8.596Zm-0.037,4c-5.89,-0.022 -10.788,3.267 -14.663,7.35c-0.527,0.555 -1.035,1.127 -1.527,1.713c-0.647,0.772 -1.265,1.569 -1.854,2.386c-0.589,0.816 -1.193,1.846 -1.672,2.721c3.814,6.409 9.539,12.198 16.582,13.611c6.563,1.317 12.688,-2.301 17.016,-6.846c0.529,-0.555 1.04,-1.128 1.534,-1.715c0.7,-0.833 1.366,-1.694 1.999,-2.579c0.586,-0.819 1.189,-1.851 1.667,-2.727c-3.958,-6.625 -10.73,-13.784 -19.082,-13.914Z" />
                  <path d="M32.158,23.948c4.425,0 8.018,3.593 8.018,8.017c0,4.425 -3.593,8.017 -8.018,8.017c-4.424,0 -8.017,-3.592 -8.017,-8.017c0,-4.424 3.593,-8.017 8.017,-8.017Zm0,4.009c2.213,0 4.009,1.796 4.009,4.008c0,2.213 -1.796,4.009 -4.009,4.009c-2.212,0 -4.008,-1.796 -4.008,-4.009c0,-2.212 1.796,-4.008 4.008,-4.008Z" />
                </svg>
              ) : (
                <svg width="28" height="18" viewBox="10 14 44 36">
                  <path d="M13.673,10.345l-3.097,3.096l39.853,39.854l3.097,-3.097l-39.853,-39.853Z" />
                  <path d="M17.119,19.984l2.915,2.915c-3.191,2.717 -5.732,6.099 -7.374,9.058l-0.005,0.01c4.573,7.646 11.829,14.872 20.987,13.776c2.472,-0.296 4.778,-1.141 6.885,-2.35l2.951,2.95c-4.107,2.636 -8.815,4.032 -13.916,3.342c-9.198,-1.244 -16.719,-8.788 -21.46,-17.648c2.226,-4.479 5.271,-8.764 9.017,-12.053Zm6.63,-4.32c2.572,-1.146 5.355,-1.82 8.327,-1.868c0.165,-0.001 2.124,0.092 3.012,0.238c0.557,0.092 1.112,0.207 1.659,0.35c8.725,2.273 15.189,9.649 19.253,17.248c-1.705,3.443 -3.938,6.803 -6.601,9.682l-2.827,-2.827c1.967,-2.12 3.607,-4.48 4.87,-6.769c0,0 -1.27,-2.042 -2.233,-3.324c-0.619,-0.824 -1.27,-1.624 -1.954,-2.395c-0.54,-0.608 -2.637,-2.673 -3.136,-3.103c-3.348,-2.879 -7.279,-5.138 -11.994,-5.1c-1.826,0.029 -3.582,0.389 -5.249,0.995l-3.127,-3.127Z" />
                  <path d="M25.054,27.92l2.399,2.398c-0.157,0.477 -0.243,0.987 -0.243,1.516c0,2.672 2.169,4.841 4.841,4.841c0.529,0 1.039,-0.085 1.516,-0.243l2.399,2.399c-1.158,0.65 -2.494,1.02 -3.915,1.02c-4.425,0 -8.017,-3.592 -8.017,-8.017c0,-1.421 0.371,-2.756 1.02,-3.914Zm6.849,-4.101c0.049,-0.001 0.099,-0.002 0.148,-0.002c4.425,0 8.017,3.593 8.017,8.017c0,0.05 0,0.099 -0.001,0.148l-8.164,-8.163Z" />
                </svg>
              )}
            </div>
          </div>

          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <div className="flex items-baseline justify-between">
          <button
            type="submit"
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
          >
            {t('continue')}
          </button>
        </div>
      </form>
    </main>
  );
};
