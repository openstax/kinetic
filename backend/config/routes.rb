# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    api_version(
      module: 'V0',
      path: { value: 'v0' },
      defaults: { format: :json }
    ) do

      namespace :researcher do
        resources :studies do
          resources :researchers, shallow: true, except: [:update]
        end
      end

      namespace :participant do
        resources :studies, only: [:index, :show] do
          get :start
          delete :opt_out
        end
      end

      get :swagger, to: 'swagger#json'

      scope :diagnostics, controller: :diagnostics do
        get :exception
        get 'status_code/:status_code', action: :status_code
        get :me
      end
    end
  end

  match '*path', via: :all, to: 'application#error_404'
end
