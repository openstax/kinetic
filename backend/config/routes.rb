# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
Rails.application.routes.draw do
  namespace :api do
    api_version(
      module: 'V1',
      path: { value: 'v1' },
      defaults: { format: :json },
      default: true
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

      namespace :admin do
        resources :rewards
        resources :banners
      end

      get :openapi, to: 'open_api#json', constraints: { format: :json }

      get :environment, to: 'environment#index'

      resources :eligibility, only: [:index]

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
      get 'user/api/user', to: 'users#user_info'
    end
  end

  # Some routes to give us url and path helpers for the frontend app
  scope as: :frontend do
    # production serves the generated index.html file. other env will redirect to dev server
    get 'study/land/:study_id', as: :returning, via: :get, to: 'static#catchall'
  end

  match '*path', via: :get, to: 'static#catchall'
  match '*path', via: :all, to: 'static#error404'
end
# rubocop:enable Metrics/BlockLength
