class Challenge < ActiveRecord::Base
	validates :pano, :presence => {:unless => Proc.new { |a| a.lat.present? && a.lng.present?}}
end