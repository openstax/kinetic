class Api::V1::BadgeCertificateController < Api::V1::BaseController
def show
    badge_id = params[:badge_id]
    email = params[:email]

    if badge_id.blank? || email.blank?
        render json: { error: 'Badge ID and email are required' }, status: :unprocessable_entity
    return
    end

    response = OpenBadgeApi.instance.get_pdf(badge_id, email)
    
    if response[:pdf].present?
        
        pdf_content = response[:pdf].read
        base64_pdf = Base64.encode64(pdf_content)
        render json: { pdf: base64_pdf }, status: :ok
    else
        render json: { error: 'Failed to retrieve PDF' }, status: :bad_request
    end
end
end

  