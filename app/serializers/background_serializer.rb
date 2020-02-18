class BackgroundSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :url
end
