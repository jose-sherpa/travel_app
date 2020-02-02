RSpec.shared_context 'json time' do
  def json_time(time)
    time.strftime('%Y-%m-%dT%H:%M:%S.000Z')
  end
end
