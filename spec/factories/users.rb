FactoryBot.define do
  factory :user do
    password { Faker::Internet.password(min_length: 8) }
    email { Faker::Internet.email }

    trait :as_admin do
      role { 'admin' }
    end

    trait :as_manager do
      role { 'manager' }
    end
  end
end
