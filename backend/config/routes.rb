# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
Rails.application.routes.draw do
  namespace :api do
    api_version(
      module: 'V0',
      path: { value: 'v0' },
      defaults: { format: :json }
    ) do

      namespace :researcher do
        resources :studies do
          post 'researcher/:user_id', to: 'study_researchers#create'
          delete 'researcher/:user_id', to: 'study_researchers#destroy'

          resources :stages, shallow: true, only: [:create, :show, :update, :destroy]
        end
      end

      namespace :participant do
        resources :studies, only: [:index, :show] do
          put :launch
          put :land
          delete :opt_out
        end
      end

      get :swagger, to: 'swagger#json', constraints: { format: :json }

      controller :misc do
        get :whoami
        get :environment
      end

      scope :diagnostics, controller: :diagnostics do
        get :exception
        get 'status_code/:status_code', action: :status_code
        get :me
      end
    end
  end

  if Rails.env.development? || Rails.env.test?
    namespace :development do
      resources :users, only: [:index] do
        put :log_in
        delete :log_out, on: :collection
        put :ensure_users_exist, on: :collection
        get :whoami, on: :collection
      end
    end
  end

  # Some routes to give us url and path helpers for the frontend app
  scope as: :frontend do
    get 'study/land/:study_id', as: :returning, via: :get, to: 'static#catchall'
  end

  match '*path', via: :get, to: 'static#catchall'
  match '*path', via: :all, to: 'static#error404'
end
# rubocop:enable Metrics/BlockLength
