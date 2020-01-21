class CreateUserSessions < ActiveRecord::Migration[5.2]
  def change
    create_table :user_sessions do |t|
      t.belongs_to :user, null: false, index: true
      t.boolean :deleted, null: false, default: false, index: true

      t.timestamps
    end
  end
end
