module DisableForgeryProtection
  private

  def verify_authenticity_token(*args)
    puts 'not protecting from forgery'
  end
end