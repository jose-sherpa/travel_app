FactoryBot.define do
  factory :user_session do
    user { build(:user) }

    trait :as_admin do
      user { build(:user, :as_admin) }
    end

    trait :as_manager do
      user { build(:user, :as_manager) }
    end
  end
end
