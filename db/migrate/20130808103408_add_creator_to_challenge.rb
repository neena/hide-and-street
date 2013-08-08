class AddCreatorToChallenge < ActiveRecord::Migration
  def change
  	change_table :challenges do |t|
    	t.belongs_to :creator
  	end
  end
end
