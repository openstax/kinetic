# frozen_string_literal: true

class Api::V1::Researcher::ResponsesController < Api::V1::BaseController

  def fetch_responses
    (status, responses) = find_or_create_responses(
      params[:cutoff] ? params[:cutoff].to_datetime : Date.today,
      !has_enclaves_token?
    )

    render status: status, json: Api::V1::Bindings::Responses.new(
      status: responses.all?(&:is_complete) ? 'complete' : 'pending',
      response_urls: responses.filter(&:is_complete).flat_map { |r| r.files.map { |f| url_for(f) } }
    )
  end

  def fetch_info
    analysis = Analysis.find(params[:analysis_id])
    return [:not_found, []] if analysis.nil?
    raise SecurityTransgression if analysis.researchers.where({ user_id: current_user_uuid }).none?

    urls = analysis.studies.flat_map do |studies|
      studies.analysis_infos.map { |info| url_for(info) }
    end

    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token, Auth-Token, Email, X-User-Token, X-User-Email'
    response.headers['Access-Control-Max-Age'] = '86400'
    render status: status, json: { info_urls: urls }
  end

  private

  def find_or_create_responses(cutoff, is_testing)
    analysis = Analysis.find_by(api_key: params[:api_key])
    return [:not_found, []] if analysis.nil?

    # add a day so that it gets everything that's contained in the day requested
    responses = analysis.response_exports
                  .for_cutoff(cutoff)
                  .where(is_testing: is_testing)
                  .order(created_at: :desc)

    if responses.none? || responses.first.is_stale?(cutoff)
      responses = analysis.stages.map do |stage|
        stage.response_exports.create!(
          is_testing: is_testing, cutoff_at: cutoff
          )
      end
    end

    [:ok, responses]
  end

end
