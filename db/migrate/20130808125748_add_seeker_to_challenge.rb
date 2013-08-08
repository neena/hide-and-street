class AddSeekerToChallenge < ActiveRecord::Migration
  def change
  	change_table :challenges do |t|
    	t.belongs_to :seeker
  	end
  end
end
