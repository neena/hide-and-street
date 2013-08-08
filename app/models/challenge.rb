class Challenge < ActiveRecord::Base
	validates :pano, :presence => {:unless => Proc.new { |a| a.lat.present? && a.lng.present?}}
	belongs_to :creator, :class_name => "User"
end