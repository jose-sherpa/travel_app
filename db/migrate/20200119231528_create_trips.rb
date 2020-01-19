class CreateTrips < ActiveRecord::Migration[5.2]
  def change
    create_table :trips do |t|
      t.string :destination, null: false
      t.datetime :start_date, null: false
      t.datetime :end_date, null: false
      t.text :comment
      t.belongs_to :user, null: false

      t.timestamps
    end
  end
end
