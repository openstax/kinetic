# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    api_version(
      module: 'V0',
      path: { value: 'v0' },
      defaults: { format: :json }
    ) do

      # resources :highlights do
      #   get :summary, on: :collection
      # end

      get :swagger, to: 'swagger#json'

      # get :info, to: 'info#info'

      scope :diagnostics, controller: :diagnostics do
        get :exception
        get 'status_code/:status_code', action: :status_code
        get :me
      end
    end
  end

  match '*path', via: :all, to: 'application#error_404'
end
