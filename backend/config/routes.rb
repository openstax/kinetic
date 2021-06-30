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
        put :ensure_an_admin_exists, on: :collection
        get :whoami, on: :collection
      end
    end
  end

  # Some routes to give us url and path helpers for the frontend app
  scope as: :frontend do
    get 'returning/:id', as: :returning, to: 'none#none'
  end

  match '*path', via: :all, to: 'application#error404'
end
# rubocop:enable Metrics/BlockLength
