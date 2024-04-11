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
        get 'public_studies', to: 'studies#public_studies'
        resources :studies do
          post 'researcher/:user_id', to: 'study_researchers#create'
          delete 'researcher/:user_id', to: 'study_researchers#destroy'
          resources :stages, shallow: true, only: [:create, :show, :update, :destroy]
        end
        post 'studies/:id/update_status', to: 'studies#update_status'

        resources :analysis do
          put 'run/:run_id', to: 'analysis#update_run'
          get 'run/:run_id/results',
              to: 'analysis#download_run_results',
              as: :run_download
        end

        get 'responses/:api_key', to: 'responses#fetch_responses'
        get 'responses/:analysis_id/info', to: 'responses#fetch_info'
      end

      namespace :participant do
        resources :studies, only: [:index, :show] do
          put :launch
          put :land
          put :stats
          delete :opt_out
        end
      end

      namespace :enclave do
        resources :runs, only: [:create] do
          post 'upload_results', to: 'runs#upload_results', on: :collection
          put 'completion', to: 'runs#completion', on: :collection
          post 'log', to: 'runs#log', on: :collection
        end
      end

      namespace :admin do
        resources :rewards
        resources :banners
        resources :learning_paths

        get 'studies/:status', to: 'studies#index'
        post 'studies/:id/approve', to: 'studies#approve'
        post 'studies/feature', to: 'studies#feature'
        post 'studies/highlight', to: 'studies#highlight'
        post 'studies/welcome', to: 'studies#welcome'
        get 'study/:id/files', to: 'studies#files'
        get 'study/:id/responses', to: 'studies#responses'
        post 'stage/:stage_id/responses', to: 'studies#add_response'
        post 'stage/:stage_id/infos', to: 'studies#add_info'
        delete 'response/:id', to: 'studies#destroy_response'
        delete 'info/:id', to: 'studies#destroy_info'

        get 'impersonate/researcher/:id', to: 'impersonate#impersonate_researcher'
        get 'impersonate/stop', to: 'impersonate#stop'

        get 'reports/learner-activity', to: 'reports#learner_activity'
      end

      get :openapi, to: 'open_api#json', constraints: { format: :json }

      get :environment, to: 'environment#index'

      resources :eligibility, only: [:index]

      resources :preferences, only: [:index, :create]

      resources :researchers do
        post 'avatar_upload'
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
    # production serves the generated index.html file. other env will redirect to dev server
    get 'study/land/:study_id', as: :returning, via: :get, to: 'static#catchall'
  end

  get 'ping' => 'rails/health#show', as: :rails_health_check
  match '/', via: :get, to: 'static#catchall'
  match '*path', via: :get, to: 'static#catchall', constraints: lambda { |req|
    req.path.exclude? 'files'
  }
end
# rubocop:enable Metrics/BlockLength
