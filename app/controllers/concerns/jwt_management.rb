require 'active_support/concern'
require 'jwt'

module JwtManagement
  extend ActiveSupport::Concern

  def hmac_secret
    Rails.application.secrets.jwt_secret
  end

  def create_token(user_json = nil)
    iat = Time.current.to_i
    iat_payload = { iat: iat }
    iat_payload.merge! data: user_json if user_json

    JWT.encode iat_payload, hmac_secret, 'HS256'
  end

  def decode_token(token)
    JWT.decode token, hmac_secret, true
  rescue JWT::InvalidIatError, JWT::VerificationError, JWT::DecodeError
    nil
  end

  def encoded_token
    @encoded_token ||= ActionController::HttpAuthentication::Token.token_and_options(request).try(:first)
  end

  def token_payload
    @token_payload ||= _token_payload
  end

  private

  def _token_payload
    decoded_token = decode_token(encoded_token)
    decoded_token&.first
  end
end
