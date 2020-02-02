FactoryBot.define do
  factory :trip do
    destination { Faker::Address.country }
    start_date { Time.current }
    end_date { Time.current + 1.week }
    user { build(:user) }
  end
end
